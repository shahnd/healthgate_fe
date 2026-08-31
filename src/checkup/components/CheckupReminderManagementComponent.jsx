import PageHeader from '@/common/components/PageHeader'
import axios from 'axios'
import { Stethoscope } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const CHECKUP_API_URL =
  'http://localhost:8006/healthgate/checkups'

const INITIAL_SETTING_FORM = {
  settingType: 'INCOMPLETE',
  messageTemplate: '건강검진을 완료해 주세요.',
  scheduleType: 'DAILY',
  scheduleDay: 'MON',
  scheduleTime: '09:00',
  active: true,
}

export default function CheckupReminderManagementComponent() {
  const [settingList, setSettingList] = useState([])
  const [historyList, setHistoryList] = useState([])
  const [editingSettingId, setEditingSettingId] =
    useState(null)

  const [settingForm, setSettingForm] = useState(
    INITIAL_SETTING_FORM
  )

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * 자동 알림 설정과 발송 이력을 조회한다.
   */
  const loadReminderData = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const [settingsResponse, historyResponse] =
        await Promise.all([
          axios.get(
            `${CHECKUP_API_URL}/reminder-settings`
          ),
          axios.get(
            `${CHECKUP_API_URL}/reminders/history`
          ),
        ])

      setSettingList(settingsResponse.data)
      setHistoryList(historyResponse.data)
    } catch (error) {
      console.error('알림 관리 정보 조회 실패:', error)

      setErrorMessage(
        '알림 설정 또는 발송 이력을 불러오지 못했습니다.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 컴포넌트 최초 출력 시 데이터를 조회한다.
   */
  useEffect(() => {
    loadReminderData()
  }, [loadReminderData])

  /**
   * 자동 알림 설정 입력값을 변경한다.
   */
  const changeSettingForm = (event) => {
    const { name, value, type, checked } = event.target

    setSettingForm((previousForm) => ({
      ...previousForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  /**
   * 자동 알림 설정을 등록하거나 수정한다.
   */
  const saveReminderSetting = async (event) => {
    event.preventDefault()

    if (!settingForm.messageTemplate.trim()) {
      alert('메시지 템플릿을 입력해 주세요.')
      return
    }

    if (!settingForm.scheduleTime) {
      alert('실행 시간을 선택해 주세요.')
      return
    }

    const requestData = {
      settingType: settingForm.settingType,
      messageTemplate:
        settingForm.messageTemplate.trim(),
      cronSchedule: createCronSchedule(
        settingForm.scheduleType,
        settingForm.scheduleDay,
        settingForm.scheduleTime
      ),
      active: settingForm.active,
    }

    setSaving(true)

    try {
      if (editingSettingId) {
        await axios.put(
          `${CHECKUP_API_URL}/reminder-settings/${editingSettingId}`,
          requestData
        )

        alert('자동 알림 설정이 수정되었습니다.')
      } else {
        await axios.post(
          `${CHECKUP_API_URL}/reminder-settings`,
          requestData
        )

        alert('자동 알림 설정이 등록되었습니다.')
      }

      resetSettingForm()
      await loadReminderData()
    } catch (error) {
      console.error('자동 알림 설정 저장 실패:', error)
      alert('자동 알림 설정 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  /**
   * 선택한 설정을 수정 입력란에 표시한다.
   */
  const startEditingSetting = (setting) => {
    const schedule =
      parseCronSchedule(setting.cronSchedule)

    setEditingSettingId(setting.settingId)

    setSettingForm({
      settingType: setting.settingType,
      messageTemplate: setting.messageTemplate,
      scheduleType: schedule.scheduleType,
      scheduleDay: schedule.scheduleDay,
      scheduleTime: schedule.scheduleTime,
      active: setting.active,
    })

    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: 'smooth',
    })
  }

  /**
   * 자동 알림 설정 입력값을 초기화한다.
   */
  const resetSettingForm = () => {
    setEditingSettingId(null)

    setSettingForm({
      ...INITIAL_SETTING_FORM,
    })
  }

  return (
    <div className="mt-8 space-y-8">
      {/* 오류 안내 */}
      {errorMessage && (
        <div
          className="
            rounded-lg border border-red-200
            bg-red-50 px-4 py-3 text-red-700
          "
        >
          {errorMessage}
        </div>
      )}

      {/* 자동 알림 설정 */}
        <PageHeader title="자동 알림 설정" description="건강검진 자동 알림의 메시지와 실행 일정을 관리합니다." icon={Stethoscope}/>

        <form
          onSubmit={saveReminderSetting}
          className="
            grid grid-cols-1 gap-5
            lg:grid-cols-2
          "
        >
          {/* 알림 설정 종류 */}
          <div>
            <label
              htmlFor="settingType"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700
              "
            >
              알림 설정 종류
            </label>

            <select
              id="settingType"
              name="settingType"
              value={settingForm.settingType}
              onChange={changeSettingForm}
              className="
                w-full rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                outline-none focus:border-blue-500
              "
            >
              <option value="INCOMPLETE">
                미검진자 알림
              </option>

              <option value="BEFORE_CHECKUP">
                검진일 이전 알림
              </option>
            </select>
          </div>

          {/* 실행 주기 */}
          <div>
            <label
              htmlFor="scheduleType"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700
              "
            >
              실행 주기
            </label>

            <select
              id="scheduleType"
              name="scheduleType"
              value={settingForm.scheduleType}
              onChange={changeSettingForm}
              className="
                w-full rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                outline-none focus:border-blue-500
              "
            >
              <option value="DAILY">매일</option>
              <option value="WEEKDAY">평일</option>
              <option value="WEEKLY">매주</option>
            </select>
          </div>

          {/* 매주 선택 시 실행 요일 */}
          {settingForm.scheduleType === 'WEEKLY' && (
            <div>
              <label
                htmlFor="scheduleDay"
                className="
                  mb-2 block text-sm
                  font-semibold text-slate-700
                "
              >
                실행 요일
              </label>

              <select
                id="scheduleDay"
                name="scheduleDay"
                value={settingForm.scheduleDay}
                onChange={changeSettingForm}
                className="
                  w-full rounded-lg
                  border border-slate-300
                  bg-white px-4 py-2
                  outline-none focus:border-blue-500
                "
              >
                <option value="MON">월요일</option>
                <option value="TUE">화요일</option>
                <option value="WED">수요일</option>
                <option value="THU">목요일</option>
                <option value="FRI">금요일</option>
                <option value="SAT">토요일</option>
                <option value="SUN">일요일</option>
              </select>
            </div>
          )}

          {/* 실행 시간 */}
          <div>
            <label
              htmlFor="scheduleTime"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700
              "
            >
              실행 시간
            </label>

            <input
              id="scheduleTime"
              name="scheduleTime"
              type="time"
              value={settingForm.scheduleTime}
              onChange={changeSettingForm}
              className="
                w-full rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                outline-none focus:border-blue-500
              "
            />

            <p className="mt-1 text-xs text-slate-400">
              자동 알림을 실행할 시간을 선택해 주세요.
            </p>
          </div>

          {/* 메시지 템플릿 */}
          <div className="lg:col-span-2">
            <label
              htmlFor="messageTemplate"
              className="
                mb-2 block text-sm
                font-semibold text-slate-700
              "
            >
              메시지 템플릿
            </label>

            <textarea
              id="messageTemplate"
              name="messageTemplate"
              value={settingForm.messageTemplate}
              onChange={changeSettingForm}
              rows="4"
              className="
                w-full resize-none rounded-lg
                border border-slate-300
                px-4 py-3 outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* 활성화 여부 및 저장 버튼 */}
          <div
            className="
              flex items-center justify-between
              gap-4 lg:col-span-2
            "
          >
            <label className="flex items-center gap-2">
              <input
                name="active"
                type="checkbox"
                checked={settingForm.active}
                onChange={changeSettingForm}
                className="h-4 w-4"
              />

              <span
                className="
                  text-sm font-semibold text-slate-700
                "
              >
                자동 알림 활성화
              </span>
            </label>

            <div className="flex gap-3">
              {editingSettingId && (
                <button
                  type="button"
                  onClick={resetSettingForm}
                  className="
                    rounded-lg
                    border border-slate-300
                    px-4 py-2 font-semibold
                    text-slate-600
                    hover:bg-slate-50
                  "
                >
                  수정 취소
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-lg bg-blue-600
                  px-5 py-2 font-semibold text-white
                  transition hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:bg-blue-300
                "
              >
                {saving
                  ? '저장 중...'
                  : editingSettingId
                    ? '설정 수정'
                    : '설정 등록'}
              </button>
            </div>
          </div>
        </form>

        {/* 저장된 자동 알림 설정 */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-4 py-3">
                  설정 종류
                </th>

                <th className="px-4 py-3">
                  메시지
                </th>

                <th className="px-4 py-3">
                  실행 일정
                </th>

                <th className="px-4 py-3">
                  상태
                </th>

                <th className="px-4 py-3">
                  관리
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="
                      px-4 py-10 text-center
                      text-slate-500
                    "
                  >
                    자동 알림 설정을 불러오는 중입니다.
                  </td>
                </tr>
              ) : settingList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="
                      px-4 py-10 text-center
                      text-slate-500
                    "
                  >
                    등록된 자동 알림 설정이 없습니다.
                  </td>
                </tr>
              ) : (
                settingList.map((setting) => (
                  <tr
                    key={setting.settingId}
                    className="
                      border-t border-slate-100
                      text-sm text-slate-700
                    "
                  >
                    <td className="px-4 py-4">
                      {getSettingTypeName(
                        setting.settingType
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {setting.messageTemplate}
                    </td>

                    <td className="px-4 py-4">
                      <p
                        className="
                          font-semibold text-slate-700
                        "
                      >
                        {getScheduleDescription(
                          setting.cronSchedule
                        )}
                      </p>

                      <p
                        className="
                          mt-1 font-mono
                          text-xs text-slate-400
                        "
                      >
                        {setting.cronSchedule}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <ActiveStatusBadge
                        active={setting.active}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          startEditingSetting(setting)
                        }
                        className="
                          rounded-lg
                          border border-blue-300
                          px-3 py-2 font-semibold
                          text-blue-600 transition
                          hover:bg-blue-50
                        "
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 알림 발송 이력 */}
      <section
        className="
          overflow-hidden rounded-xl
          bg-white shadow-sm
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-slate-200
            px-6 py-5
          "
        >
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              알림 발송 이력
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              저장된 건강검진 알림 발송 내역입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReminderData}
            disabled={loading}
            className="
              rounded-lg !bg-slate-800
              px-4 py-2 text-sm font-semibold
              !text-white hover:!bg-slate-700
              disabled:cursor-not-allowed
              disabled:!bg-slate-400
            "
          >
            {loading ? '조회 중...' : '새로고침'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-5 py-3">번호</th>
                <th className="px-5 py-3">검진 ID</th>
                <th className="px-5 py-3">채널</th>
                <th className="px-5 py-3">
                  메시지 내용
                </th>
                <th className="px-5 py-3">
                  발송 일시
                </th>
                <th className="px-5 py-3">상태</th>
                <th className="px-5 py-3">구분</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-5 py-10 text-center
                      text-slate-500
                    "
                  >
                    알림 발송 이력을 불러오는 중입니다.
                  </td>
                </tr>
              ) : historyList.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-5 py-10 text-center
                      text-slate-500
                    "
                  >
                    저장된 알림 발송 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                historyList.map((history) => (
                  <tr
                    key={history.reminderId}
                    className="
                      border-t border-slate-100
                      text-sm text-slate-700
                    "
                  >
                    <td className="px-5 py-4">
                      {history.reminderId}
                    </td>

                    <td className="px-5 py-4">
                      {history.checkupId}
                    </td>

                    <td className="px-5 py-4">
                      {getChannelName(history.channel)}
                    </td>

                    <td className="px-5 py-4">
                      {history.content}
                    </td>

                    <td className="px-5 py-4">
                      {formatDateTime(history.sentAt)}
                    </td>

                    <td className="px-5 py-4">
                      <ReminderStatusBadge
                        status={history.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      {history.manual ? '수동' : '자동'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

/**
 * 화면 일정 선택값을 Spring Cron 표현식으로 변환한다.
 */
function createCronSchedule(
  scheduleType,
  scheduleDay,
  scheduleTime
) {
  const [hour, minute] = scheduleTime.split(':')

  if (scheduleType === 'WEEKDAY') {
    return `0 ${Number(minute)} ${Number(hour)} * * MON-FRI`
  }

  if (scheduleType === 'WEEKLY') {
    return `0 ${Number(minute)} ${Number(hour)} * * ${scheduleDay}`
  }

  return `0 ${Number(minute)} ${Number(hour)} * * *`
}

/**
 * DB의 Cron 표현식을 화면 입력값으로 변환한다.
 */
function parseCronSchedule(cronSchedule) {
  const defaultSchedule = {
    scheduleType: 'DAILY',
    scheduleDay: 'MON',
    scheduleTime: '09:00',
  }

  if (!cronSchedule) {
    return defaultSchedule
  }

  const cronParts = cronSchedule.trim().split(/\s+/)

  if (cronParts.length !== 6) {
    return defaultSchedule
  }

  const minute = String(Number(cronParts[1]))
    .padStart(2, '0')

  const hour = String(Number(cronParts[2]))
    .padStart(2, '0')

  const dayOfWeek = cronParts[5]

  if (dayOfWeek === 'MON-FRI') {
    return {
      scheduleType: 'WEEKDAY',
      scheduleDay: 'MON',
      scheduleTime: `${hour}:${minute}`,
    }
  }

  if (dayOfWeek !== '*') {
    return {
      scheduleType: 'WEEKLY',
      scheduleDay: dayOfWeek,
      scheduleTime: `${hour}:${minute}`,
    }
  }

  return {
    scheduleType: 'DAILY',
    scheduleDay: 'MON',
    scheduleTime: `${hour}:${minute}`,
  }
}

/**
 * Cron 표현식을 사용자가 이해하기 쉬운 문구로 변환한다.
 */
function getScheduleDescription(cronSchedule) {
  const schedule = parseCronSchedule(cronSchedule)

  const timeText =
    formatScheduleTime(schedule.scheduleTime)

  if (schedule.scheduleType === 'WEEKDAY') {
    return `평일 ${timeText}`
  }

  if (schedule.scheduleType === 'WEEKLY') {
    return `매주 ${getDayName(
      schedule.scheduleDay
    )} ${timeText}`
  }

  return `매일 ${timeText}`
}

/**
 * 24시간 형식 시간을 오전·오후 형식으로 변환한다.
 */
function formatScheduleTime(scheduleTime) {
  const [hourText, minute] = scheduleTime.split(':')
  const hour = Number(hourText)

  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour % 12 || 12

  return `${period} ${displayHour}:${minute}`
}

/**
 * 영문 요일을 한글로 변환한다.
 */
function getDayName(day) {
  const dayNames = {
    MON: '월요일',
    TUE: '화요일',
    WED: '수요일',
    THU: '목요일',
    FRI: '금요일',
    SAT: '토요일',
    SUN: '일요일',
  }

  return dayNames[day] ?? day
}

/**
 * 자동 알림 설정 종류를 한글로 변환한다.
 */
function getSettingTypeName(settingType) {
  if (settingType === 'INCOMPLETE') {
    return '미검진자 알림'
  }

  if (settingType === 'BEFORE_CHECKUP') {
    return '검진일 이전 알림'
  }

  return settingType
}

/**
 * 알림 발송 채널을 한글로 변환한다.
 */
function getChannelName(channel) {
  if (channel === 'SMS') {
    return 'SMS'
  }

  if (channel === 'EMAIL') {
    return '이메일'
  }

  return channel
}

/**
 * 날짜와 시간을 화면 형식으로 변환한다.
 */
function formatDateTime(dateTime) {
  if (!dateTime) {
    return '-'
  }

  return dateTime.replace('T', ' ').split('.')[0]
}

/**
 * 자동 알림 활성화 상태 표시
 */
function ActiveStatusBadge({ active }) {
  return (
    <span
      className={`
        inline-flex rounded-full px-3 py-1
        text-xs font-semibold
        ${
          active
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-200 text-slate-600'
        }
      `}
    >
      {active ? '활성화' : '비활성화'}
    </span>
  )
}

/**
 * 알림 발송 결과 상태 표시
 */
function ReminderStatusBadge({ status }) {
  const successful = status === 'SUCCESS'

  return (
    <span
      className={`
        inline-flex rounded-full px-3 py-1
        text-xs font-semibold
        ${
          successful
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-600'
        }
      `}
    >
      {successful ? '성공' : status}
    </span>
  )
}