import PageHeader from '@/common/components/PageHeader'
import axios from 'axios'
import { Stethoscope } from 'lucide-react'
import { useMemo, useState } from 'react'

const CHECKUP_API_URL =
  'http://localhost:8006/healthgate/checkups'

/**
 * Excel 업로드 후 건강검진 대상자의
 * 수검 현황을 보여주는 모달
 */
export default function CheckupExcelStatusModal({
  year,
  targetList,
  uploadResult,
  onClose,
}) {
  const [statusFilter, setStatusFilter] =
    useState('ALL')

  const [selectedIds, setSelectedIds] =
    useState([])

  const [sendingReminder, setSendingReminder] =
    useState(false)

  /**
   * 완료 상태 필터가 적용된 대상자 목록
   */
  const filteredTargetList = useMemo(() => {
    if (statusFilter === 'COMPLETED') {
      return targetList.filter(
        (target) => target.completed
      )
    }

    if (statusFilter === 'INCOMPLETE') {
      return targetList.filter(
        (target) => !target.completed
      )
    }

    return targetList
  }, [targetList, statusFilter])

  /**
   * 현재 화면에서 선택할 수 있는 미수검자 목록
   */
  const selectableTargetList = useMemo(() => {
    return filteredTargetList.filter(
      (target) => !target.completed
    )
  }, [filteredTargetList])

  /**
   * 선택된 미수검자 목록
   */
  const selectedTargetList = useMemo(() => {
    return targetList.filter(
      (target) =>
        selectedIds.includes(target.checkupId)
        && !target.completed
    )
  }, [targetList, selectedIds])

  /**
   * 현재 화면의 미수검자가 모두 선택됐는지 확인
   */
  const allSelected =
    selectableTargetList.length > 0
    && selectableTargetList.every((target) =>
      selectedIds.includes(target.checkupId)
    )

  /**
   * 미수검자 한 명 선택 또는 선택 해제
   */
  const toggleTarget = (target) => {
    if (target.completed) {
      return
    }

    setSelectedIds((previousIds) => {
      if (previousIds.includes(target.checkupId)) {
        return previousIds.filter(
          (id) => id !== target.checkupId
        )
      }

      return [
        ...previousIds,
        target.checkupId,
      ]
    })
  }

  /**
   * 현재 화면의 미수검자 전체 선택 또는 선택 해제
   */
  const toggleAllTargets = () => {
    const selectableIds =
      selectableTargetList.map(
        (target) => target.checkupId
      )

    if (allSelected) {
      setSelectedIds((previousIds) =>
        previousIds.filter(
          (id) => !selectableIds.includes(id)
        )
      )

      return
    }

    setSelectedIds((previousIds) => [
      ...new Set([
        ...previousIds,
        ...selectableIds,
      ]),
    ])
  }

  /**
   * 선택한 미수검자에게 문자 알림을 발송한다.
   *
   * 현재는 외부 SMS 서비스 연동 전이므로
   * 알림 발송 이력을 DB에 저장한다.
   */
  const sendSelectedReminders = async () => {
    if (selectedTargetList.length === 0) {
      alert('알림을 발송할 미수검자를 선택해 주세요.')
      return
    }

    const confirmed = window.confirm(
      `선택한 ${selectedTargetList.length}명에게 `
      + '건강검진 독려 알림을 발송하시겠습니까?'
    )

    if (!confirmed) {
      return
    }

    setSendingReminder(true)

    try {
      /*
       * 선택한 사람마다 기존 수동 알림 API를 호출한다.
       *
       * 한 사람의 요청이 실패해도 나머지 사람의 요청은
       * 계속 처리할 수 있도록 Promise.allSettled를 사용한다.
       */
      const results = await Promise.allSettled(
        selectedTargetList.map((target) =>
          axios.post(
            `${CHECKUP_API_URL}/reminders/manual`,
            {
              checkupId: target.checkupId,
              channel: 'SMS',
              content:
                `${target.employeeName}님, `
                + '건강검진을 완료해 주세요.',
            }
          )
        )
      )

      const successCount = results.filter(
        (result) => result.status === 'fulfilled'
      ).length

      const failureCount = results.length - successCount

      if (failureCount === 0) {
        alert(
          `${successCount}명의 알림 발송 이력이 `
          + '저장되었습니다.'
        )
      } else {
        alert(
          `알림 처리 결과\n`
          + `성공: ${successCount}명\n`
          + `실패: ${failureCount}명`
        )
      }

      /*
       * 성공한 대상자는 선택 상태에서 제거한다.
       */
      const failedIds = results
        .map((result, index) => ({
          result,
          checkupId:
            selectedTargetList[index].checkupId,
        }))
        .filter(
          ({ result }) =>
            result.status === 'rejected'
        )
        .map(({ checkupId }) => checkupId)

      setSelectedIds(failedIds)
    } catch (error) {
      console.error(
        '미수검자 일괄 알림 발송 실패:',
        error
      )

      alert(
        '선택한 대상자의 알림 발송 처리에 실패했습니다.'
      )
    } finally {
      setSendingReminder(false)
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-slate-900/50 px-4
      "
    >
      <div
        className="
          flex max-h-[90vh] w-full max-w-6xl
          flex-col overflow-hidden rounded-xl
          bg-white shadow-2xl
        "
      >
        {/* 모달 제목 */}
        <div
          className="
            flex items-start justify-between
            border-b border-slate-200
            px-6 py-5
          "
        >
          <PageHeader title="건강검진 대상자 수검 현황" description="Excel 업로드 결과가 반영된 건강검진 대상자 목록입니다." icon={Stethoscope}/>

          <button
            type="button"
            onClick={onClose}
            disabled={sendingReminder}
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

        {/* 업로드 결과 */}
        {uploadResult && (
          <div
            className="
              border-b border-emerald-200
              bg-emerald-50 px-6 py-4
            "
          >
            <p className="font-semibold text-emerald-700">
              {uploadResult.message}
            </p>

            <div className="mt-2 flex flex-wrap gap-5 text-sm">
              <span className="text-slate-600">
                전체{' '}
                <strong className="text-slate-800">
                  {uploadResult.totalCount}건
                </strong>
              </span>

              <span className="text-slate-600">
                성공{' '}
                <strong className="text-emerald-600">
                  {uploadResult.successCount}건
                </strong>
              </span>

              <span className="text-slate-600">
                실패{' '}
                <strong className="text-red-500">
                  {uploadResult.failureCount}건
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* 조회 조건 */}
        <div
          className="
            flex flex-wrap items-end gap-4
            border-b border-slate-200
            bg-slate-50 px-6 py-4
          "
        >
          <div>
            <label
              htmlFor="statusModalYear"
              className="
                mb-1 block text-sm
                font-semibold text-slate-600
              "
            >
              검진연도
            </label>

            <input
              id="statusModalYear"
              type="text"
              value={`${year}년`}
              readOnly
              className="
                w-32 rounded-lg
                border border-slate-300
                bg-white px-3 py-2
                text-slate-700
              "
            />
          </div>

          <div>
            <label
              htmlFor="checkupStatusFilter"
              className="
                mb-1 block text-sm
                font-semibold text-slate-600
              "
            >
              상태
            </label>

            <select
              id="checkupStatusFilter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setSelectedIds([])
              }}
              className="
                w-40 rounded-lg
                border border-slate-300
                bg-white px-3 py-2
                text-slate-700 outline-none
                focus:border-blue-500
              "
            >
              <option value="ALL">전체</option>
              <option value="COMPLETED">
                수검완료
              </option>
              <option value="INCOMPLETE">
                미수검
              </option>
            </select>
          </div>

          <div className="pb-2 text-sm text-slate-500">
            총 {filteredTargetList.length}명
          </div>

          <p className="pb-2 text-xs text-slate-400">
            미수검자만 선택하여 알림을 발송할 수 있습니다.
          </p>
        </div>

        {/* 대상자 현황 표 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead
              className="
                sticky top-0 z-10
                bg-slate-100
              "
            >
              <tr className="text-left text-sm text-slate-600">
                <th className="w-16 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllTargets}
                    disabled={
                      selectableTargetList.length === 0
                      || sendingReminder
                    }
                    aria-label="미수검자 전체 선택"
                  />
                </th>

                <th className="w-20 px-4 py-3">
                  순번
                </th>

                <th className="px-4 py-3">
                  사번
                </th>

                <th className="px-4 py-3">
                  성명
                </th>

                <th className="px-4 py-3">
                  검진연도
                </th>

                <th className="px-4 py-3">
                  검진일
                </th>

                <th className="px-4 py-3">
                  검진요약
                </th>

                <th className="px-4 py-3">
                  일반검진
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTargetList.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="
                      px-6 py-16 text-center
                      text-slate-500
                    "
                  >
                    조건에 해당하는 대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTargetList.map(
                  (target, index) => (
                    <tr
                      key={target.checkupId}
                      className={`
                        border-t border-slate-100
                        text-sm text-slate-700
                        ${
                          target.completed
                            ? 'bg-slate-50'
                            : 'hover:bg-blue-50'
                        }
                      `}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            target.checkupId
                          )}
                          onChange={() =>
                            toggleTarget(target)
                          }
                          disabled={
                            target.completed
                            || sendingReminder
                          }
                          title={
                            target.completed
                              ? '수검완료자는 알림 대상이 아닙니다.'
                              : '알림 대상 선택'
                          }
                          aria-label={
                            `${target.employeeName} 선택`
                          }
                        />
                      </td>

                      <td className="px-4 py-4">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        {target.employeeNo}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {target.employeeName}
                      </td>

                      <td className="px-4 py-4">
                        {target.checkupYear}년
                      </td>

                      <td className="px-4 py-4">
                        {target.checkupDate ?? '-'}
                      </td>

                      <td className="px-4 py-4">
                        {target.checkupSummary ?? '-'}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge
                          completed={target.completed}
                        />
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 버튼 영역 */}
        <div
          className="
            flex items-center justify-between
            border-t border-slate-200
            px-6 py-4
          "
        >
          <p className="text-sm text-slate-500">
            선택한 미수검자:
            <strong className="ml-1 text-blue-600">
              {selectedTargetList.length}명
            </strong>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sendingReminder}
              className="
                rounded-lg
                border border-slate-300
                !bg-white px-5 py-2
                font-semibold !text-slate-600
                transition hover:!bg-slate-50
                disabled:cursor-not-allowed
              "
            >
              닫기
            </button>

            <button
              type="button"
              onClick={sendSelectedReminders}
              disabled={
                selectedTargetList.length === 0
                || sendingReminder
              }
              className="
                rounded-lg !bg-blue-600
                px-5 py-2 font-semibold
                !text-white transition
                hover:!bg-blue-700
                disabled:cursor-not-allowed
                disabled:!bg-blue-300
              "
            >
              {sendingReminder
                ? '알림 처리 중...'
                : `선택 대상 알림 발송 (${selectedTargetList.length}명)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ completed }) {
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
      {completed ? '수검완료' : '미수검'}
    </span>
  )
}