import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import CheckupReminderManagementComponent
  from './CheckupReminderManagementComponent'

import PageHeader from '@/common/components/PageHeader'
import { Stethoscope } from 'lucide-react'

const CHECKUP_API_URL =
  '/healthgate/checkups'

export default function CheckupManagementComponent() {
  const currentYear = new Date().getFullYear()

  const [year, setYear] = useState(currentYear)

  const [statistics, setStatistics] = useState({
    checkupYear: currentYear,
    totalCount: 0,
    completedCount: 0,
    incompleteCount: 0,
    completionRate: 0,
  })

  const [targetList, setTargetList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 수동 알림 관련 State
  const [selectedTarget, setSelectedTarget] =
    useState(null)

  const [reminderChannel, setReminderChannel] =
    useState('EMAIL')

  const [reminderContent, setReminderContent] =
    useState('')

  const [sendingReminder, setSendingReminder] =
    useState(false)

  // Excel 파일 업로드 모달 관련 State
  const [excelModalOpen, setExcelModalOpen] =
    useState(false)

  const [excelFile, setExcelFile] =
    useState(null)

  const [uploadingExcel, setUploadingExcel] =
    useState(false)

  const [excelUploadResult, setExcelUploadResult] =
    useState(null)

  /**
   * 검진 완료율 통계와 대상자 목록 조회
   */
  const loadCheckupData = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const [statisticsResponse, targetsResponse] =
        await Promise.all([
          axios.get(
            `${CHECKUP_API_URL}/statistics`,
            {
              params: { year },
            }
          ),
          axios.get(
            `${CHECKUP_API_URL}/targets`,
            {
              params: { year },
            }
          ),
        ])

      setStatistics(statisticsResponse.data)
      setTargetList(targetsResponse.data)

      return targetsResponse.data
    } catch (error) {
      console.error(
        '건강검진 데이터 조회 실패:',
        error
      )

      setErrorMessage(
        '건강검진 정보를 불러오지 못했습니다.'
      )

      return []
    } finally {
      setLoading(false)
    }
  }, [year])

  /**
   * 최초 출력 및 조회 연도 변경 시 실행
   */
  useEffect(() => {
    loadCheckupData()
  }, [loadCheckupData])

  /**
   * Excel 업로드 모달 열기
   */
  const openExcelModal = () => {
    setExcelFile(null)
    setExcelUploadResult(null)
    setExcelModalOpen(true)
  }

  /**
   * Excel 업로드 모달 닫기
   */
  const closeExcelModal = () => {
    if (uploadingExcel) {
      return
    }

    setExcelModalOpen(false)
    setExcelFile(null)
    setExcelUploadResult(null)
  }

  /**
   * Excel 파일 선택
   */
  const handleExcelFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    setExcelUploadResult(null)

    if (!selectedFile) {
      setExcelFile(null)
      return
    }

    const lowerFileName =
      selectedFile.name.toLowerCase()

    if (
      !lowerFileName.endsWith('.xlsx')
      && !lowerFileName.endsWith('.xls')
    ) {
      alert(
        'Excel 파일(.xlsx, .xls)만 선택할 수 있습니다.'
      )

      event.target.value = ''
      setExcelFile(null)
      return
    }

    setExcelFile(selectedFile)
  }

  /**
   * 건강검진 결과 Excel 업로드
   */
  const uploadCheckupExcel = async () => {
    if (!excelFile) {
      alert('업로드할 Excel 파일을 선택해 주세요.')
      return
    }

    const formData = new FormData()
    formData.append('file', excelFile)

    setUploadingExcel(true)
    setExcelUploadResult(null)

    try {
      const response = await axios.post(
        `${CHECKUP_API_URL}/excel-upload`,
        formData
      )

      const uploadResult = response.data

      setExcelUploadResult(uploadResult)

      // 변경된 통계와 대상자 목록을 다시 조회한다.
      await loadCheckupData()

      if (uploadResult.successCount > 0) {
        setExcelModalOpen(false)
        setExcelFile(null)
      }
    } catch (error) {
      console.error(
        '건강검진 Excel 업로드 실패:',
        error
      )

      const serverMessage =
        error.response?.data?.message

      setExcelUploadResult({
        totalCount: 0,
        successCount: 0,
        failureCount: 1,
        errors: [
          serverMessage
          || 'Excel 업로드 처리에 실패했습니다.',
        ],
        message: 'Excel 업로드에 실패했습니다.',
      })
    } finally {
      setUploadingExcel(false)
    }
  }

  /**
   * 수동 알림 발송 창 열기
   */
  const openReminderModal = (target) => {
    const confirmed = window.confirm(
      `${target.employeeName}님에게 독려 알림을 발송하시겠습니까?`
    )

    if (!confirmed) {
      return
    }

    setSelectedTarget(target)
    setReminderChannel('EMAIL')
    setReminderContent(
      `${target.employeeName}님, 건강검진을 완료해 주세요.`
    )
  }

  /**
   * 수동 알림 발송 창 닫기
   */
  const closeReminderModal = () => {
    if (sendingReminder) {
      return
    }

    setSelectedTarget(null)
    setReminderChannel('EMAIL')
    setReminderContent('')
  }

  /**
   * 수동 알림 발송 및 발송 이력 저장
   */
  const sendManualReminder = async () => {
    if (!selectedTarget) {
      return
    }

    if (!reminderContent.trim()) {
      alert('알림 내용을 입력해 주세요.')
      return
    }

    setSendingReminder(true)

    try {
      await axios.post(
        `${CHECKUP_API_URL}/reminders/manual`,
        {
          checkupId: selectedTarget.checkupId,
          channel: reminderChannel,
          content: reminderContent.trim(),
        }
      )

      alert('알림 발송 이력이 저장되었습니다.')

      setSelectedTarget(null)
      setReminderContent('')
    } catch (error) {
      console.error('수동 알림 발송 실패:', error)
      alert('알림 발송 처리에 실패했습니다.')
    } finally {
      setSendingReminder(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      {/* 페이지 제목 */}
      <PageHeader title="건강검진 관리" description="건강검진 완료율과 대상자 및 알림을 관리합니다." icon={Stethoscope}/>

      {/* 연도 선택 */}
      <section
        className="
          mb-6 rounded-xl bg-white
          p-5 shadow-sm
        "
      >
        <div className="flex items-center gap-3">
          <label
            htmlFor="checkupYear"
            className="font-semibold text-slate-700"
          >
            검진 연도
          </label>

          <select
            id="checkupYear"
            value={year}
            onChange={(event) =>
              setYear(Number(event.target.value))
            }
            className="
              rounded-lg border border-slate-300
              bg-white px-4 py-2 text-slate-700
              outline-none focus:border-blue-500
            "
          >
            <option value={currentYear - 2}>
              {currentYear - 2}년
            </option>

            <option value={currentYear - 1}>
              {currentYear - 1}년
            </option>

            <option value={currentYear}>
              {currentYear}년
            </option>

            <option value={currentYear + 1}>
              {currentYear + 1}년
            </option>
          </select>

          <button
            type="button"
            onClick={loadCheckupData}
            disabled={loading}
            className="
              rounded-lg !bg-slate-800
              px-4 py-2 text-sm
              font-semibold !text-white
              transition hover:!bg-slate-700
              disabled:cursor-not-allowed
              disabled:!bg-slate-400
            "
          >
            {loading ? '조회 중...' : '새로고침'}
          </button>
        </div>
      </section>

      {/* 오류 안내 */}
      {errorMessage && (
        <div
          className="
            mb-6 rounded-lg
            border border-red-200
            bg-red-50 px-4 py-3
            text-red-700
          "
        >
          {errorMessage}
        </div>
      )}

      {/* 검진 완료율 통계 */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          검진 완료율 통계
        </h2>

        <div
          className="
            grid grid-cols-1 gap-4
            md:grid-cols-4
          "
        >
          <StatisticsCard
            title="전체 대상자"
            value={statistics.totalCount}
            unit="명"
            color="text-slate-800"
          />

          <StatisticsCard
            title="검진 완료"
            value={statistics.completedCount}
            unit="명"
            color="text-emerald-600"
          />

          <StatisticsCard
            title="검진 미완료"
            value={statistics.incompleteCount}
            unit="명"
            color="text-red-500"
          />

          <StatisticsCard
            title="완료율"
            value={statistics.completionRate}
            unit="%"
            color="text-blue-600"
          />
        </div>
      </section>

      {/* 검진 대상자 목록 */}
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
              검진 대상자 목록
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              총 {targetList.length}명의 대상자가
              조회되었습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={openExcelModal}
            className="
              rounded-lg !bg-blue-600
              px-4 py-2 text-sm
              font-semibold !text-white
              transition hover:!bg-blue-700
            "
          >
            엑셀 업로드
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-6 py-3">사번</th>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">
                  검진 연도
                </th>
                <th className="px-6 py-3">검진일</th>
                <th className="px-6 py-3">
                  검진 요약
                </th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">알림</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-6 py-12 text-center
                      text-slate-500
                    "
                  >
                    건강검진 정보를 불러오는 중입니다.
                  </td>
                </tr>
              ) : targetList.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-6 py-12 text-center
                      text-slate-500
                    "
                  >
                    해당 연도의 검진 대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                targetList.map((target) => (
                  <tr
                    key={target.checkupId}
                    className="
                      border-t border-slate-100
                      text-sm text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <td className="px-6 py-4">
                      {target.employeeNo}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {target.employeeName}
                    </td>

                    <td className="px-6 py-4">
                      {target.checkupYear}년
                    </td>

                    <td className="px-6 py-4">
                      {target.checkupDate ?? '-'}
                    </td>

                    <td className="px-6 py-4">
                      {target.checkupSummary ?? '-'}
                    </td>

                    <td className="px-6 py-4">
                      <CheckupStatusBadge
                        completed={target.completed}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        disabled={target.completed}
                        onClick={() =>
                          openReminderModal(target)
                        }
                        className={`
                          rounded-lg px-3 py-2
                          text-sm font-semibold transition
                          ${
                            target.completed
                              ? `
                                cursor-not-allowed
                                !bg-slate-200
                                !text-slate-400
                              `
                              : `
                                !bg-blue-600
                                !text-white
                                hover:!bg-blue-700
                              `
                          }
                        `}
                      >
                        알림 발송
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 자동 알림 설정 및 알림 발송 이력 */}
      <CheckupReminderManagementComponent />

      {/* Excel 파일 선택 및 업로드 모달 */}
      {excelModalOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-900/50 px-4
          "
        >
          <div
            className="
              w-full max-w-xl rounded-xl
              bg-white p-6 shadow-xl
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  건강검진 결과 엑셀 업로드
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  건강검진 결과가 입력된 Excel 파일을
                  선택해 주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={closeExcelModal}
                disabled={uploadingExcel}
                className="
                  rounded-lg px-3 py-1
                  text-xl !text-slate-400
                  hover:!bg-slate-100
                  hover:!text-slate-700
                  disabled:cursor-not-allowed
                "
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {/* Excel 양식 안내 */}
            <div
              className="
                mt-5 rounded-lg
                border border-blue-200
                bg-blue-50 p-4
              "
            >
              <p className="font-semibold text-blue-800">
                Excel 열 순서
              </p>

              <p className="mt-1 text-sm text-blue-700">
                사번 | 이름 | 검진연도 | 검진일 | 검진요약
              </p>

              <p className="mt-1 text-xs text-blue-600">
                첫 번째 행에는 위 제목을 입력하고,
                두 번째 행부터 대상자 정보를 입력해 주세요.
              </p>
            </div>

            {/* 파일 선택 */}
            <div className="mt-6">
              <label
                htmlFor="checkupExcelFile"
                className="
                  mb-2 block font-semibold
                  text-slate-700
                "
              >
                첨부파일
              </label>

              <input
                id="checkupExcelFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelFileChange}
                disabled={uploadingExcel}
                className="
                  block w-full rounded-lg
                  border border-slate-300
                  bg-white px-3 py-2
                  text-sm text-slate-600
                  file:mr-4 file:rounded-md
                  file:border-0
                  file:bg-blue-50
                  file:px-4 file:py-2
                  file:font-semibold
                  file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:cursor-not-allowed
                "
              />

              <p className="mt-2 text-xs text-slate-400">
                지원 형식: .xlsx, .xls
              </p>
            </div>

            {/* 선택한 파일 */}
            {excelFile && (
              <div
                className="
                  mt-4 rounded-lg
                  border border-slate-200
                  bg-slate-50 px-4 py-3
                "
              >
                <p className="text-sm text-slate-700">
                  선택한 파일:
                  <span className="ml-2 font-semibold">
                    {excelFile.name}
                  </span>
                </p>
              </div>
            )}

            {/* 업로드 실패 결과 */}
            {excelUploadResult
              && excelUploadResult.failureCount > 0
              && excelUploadResult.successCount === 0
              && (
                <div
                  className="
                    mt-5 rounded-lg
                    border border-red-200
                    bg-red-50 p-4
                  "
                >
                  <p className="font-semibold text-red-700">
                    {excelUploadResult.message}
                  </p>

                  {excelUploadResult.errors?.length > 0 && (
                    <ul
                      className="
                        mt-3 list-disc pl-5
                        text-sm text-red-600
                      "
                    >
                      {excelUploadResult.errors.map(
                        (uploadError, index) => (
                          <li key={index}>
                            {uploadError}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              )}

            {/* 버튼 영역 */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeExcelModal}
                disabled={uploadingExcel}
                className="
                  rounded-lg
                  border border-slate-300
                  !bg-white px-4 py-2
                  font-semibold !text-slate-600
                  transition hover:!bg-slate-50
                  disabled:cursor-not-allowed
                "
              >
                닫기
              </button>

              <button
                type="button"
                onClick={uploadCheckupExcel}
                disabled={!excelFile || uploadingExcel}
                className="
                  rounded-lg !bg-blue-600
                  px-4 py-2 font-semibold
                  !text-white transition
                  hover:!bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:!bg-blue-300
                "
              >
                {uploadingExcel
                  ? '업로드 중...'
                  : '업로드'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수동 알림 발송 모달 */}
      {selectedTarget && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-900/50 px-4
          "
        >
          <div
            className="
              w-full max-w-lg rounded-xl
              bg-white p-6 shadow-xl
            "
          >
            <h2 className="text-xl font-bold text-slate-800">
              수동 알림 발송
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {selectedTarget.employeeName}
              {' ('}
              {selectedTarget.employeeNo}
              {')'}
            </p>

            <div className="mt-6">
              <label
                htmlFor="reminderChannel"
                className="
                  mb-2 block font-semibold
                  text-slate-700
                "
              >
                발송 채널
              </label>

              <select
                id="reminderChannel"
                value={reminderChannel}
                onChange={(event) =>
                  setReminderChannel(event.target.value)
                }
                className="
                  w-full rounded-lg
                  border border-slate-300
                  px-4 py-2 outline-none
                  focus:border-blue-500
                "
              >
                <option value="SMS" disabled>SMS (준비 중)</option>
                <option value="EMAIL">이메일</option>
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="reminderContent"
                className="
                  mb-2 block font-semibold
                  text-slate-700
                "
              >
                알림 내용
              </label>

              <textarea
                id="reminderContent"
                value={reminderContent}
                onChange={(event) =>
                  setReminderContent(event.target.value)
                }
                rows="5"
                className="
                  w-full resize-none rounded-lg
                  border border-slate-300
                  px-4 py-3 outline-none
                  focus:border-blue-500
                "
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              현재는 실제 메시지를 전송하지 않고
              발송 이력을 저장합니다.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReminderModal}
                disabled={sendingReminder}
                className="
                  rounded-lg
                  border border-slate-300
                  !bg-white px-4 py-2
                  font-semibold !text-slate-600
                  transition hover:!bg-slate-50
                  disabled:cursor-not-allowed
                "
              >
                취소
              </button>

              <button
                type="button"
                onClick={sendManualReminder}
                disabled={sendingReminder}
                className="
                  rounded-lg !bg-blue-600
                  px-4 py-2 font-semibold
                  !text-white transition
                  hover:!bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:!bg-blue-300
                "
              >
                {sendingReminder
                  ? '처리 중...'
                  : '발송'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

/**
 * 통계 카드
 */
function StatisticsCard({
  title,
  value,
  unit,
  color,
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className={`mt-3 text-3xl font-bold ${color}`}>
        {value}

        <span className="ml-1 text-base font-medium">
          {unit}
        </span>
      </p>
    </div>
  )
}

/**
 * 검진 완료 상태 표시
 */
function CheckupStatusBadge({ completed }) {
  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          completed
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-600'
        }
      `}
    >
      {completed ? '완료' : '미완료'}
    </span>
  )
}
