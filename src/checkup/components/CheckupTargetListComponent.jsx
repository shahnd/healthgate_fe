import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

const CHECKUP_API_URL =
  "http://localhost:8006/healthgate/checkups";

/**
 * 수동 알림 재발송 제한 시간
 * 3시간 = 3 × 60 × 60 × 1000ms
 */
const REMINDER_COOLDOWN_MS =
  3 * 60 * 60 * 1000;

export default function CheckupTargetListComponent() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [targetList, setTargetList] = useState([]);

  // 현재 화면에서 Excel 업로드가 완료됐는지 여부
  const [hasUploadedExcel, setHasUploadedExcel] =
    useState(false);

  /**
   * 대상자 상태 필터
   * ALL: 전체 / COMPLETED: 완료 / INCOMPLETE: 미완료
   */
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [reminderHistory, setReminderHistory] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  /**
   * 카운트다운 계산에 사용하는 현재 시각
   */
  const [now, setNow] = useState(Date.now());

  // Excel 업로드 결과 안내
  const [uploadNotice, setUploadNotice] =
    useState(null);

  // Excel 업로드 모달
  const [excelModalOpen, setExcelModalOpen] =
    useState(false);

  const [excelFile, setExcelFile] =
    useState(null);

  const [uploadingExcel, setUploadingExcel] =
    useState(false);

  const [excelUploadError, setExcelUploadError] =
    useState(null);

  // 수동 알림 모달
  const [selectedTarget, setSelectedTarget] =
    useState(null);

  const [reminderChannel, setReminderChannel] =
    useState("SMS");

  const [reminderContent, setReminderContent] =
    useState("");

  const [sendingReminder, setSendingReminder] =
    useState(false);

  /**
   * 연도별 건강검진 대상자 목록 조회
   */
  const loadTargetList = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${CHECKUP_API_URL}/targets`,
        {
          params: {
            year,
          },
        }
      );

      const result = response.data ?? [];

      setTargetList(result);

      return result;
    } catch (error) {
      console.error(
        "건강검진 대상자 조회 실패:",
        error
      );

      setErrorMessage(
        "건강검진 대상자 목록을 불러오지 못했습니다."
      );

      setTargetList([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, [year]);

  /**
   * 수동 알림 발송 이력 조회
   *
   * 이 이력의 발송 시간을 이용하여
   * 대상자별 3시간 재발송 제한 시간을 계산한다.
   */
  const loadReminderHistory =
    useCallback(async () => {
      try {
        const response = await axios.get(
          `${CHECKUP_API_URL}/reminders/history`
        );

        setReminderHistory(response.data ?? []);

        return response.data ?? [];
      } catch (error) {
        console.error(
          "알림 발송 이력 조회 실패:",
          error
        );

        setReminderHistory([]);

        return [];
      }
    }, []);

  /**
   * 최초 화면에서는 알림 이력만 조회한다.
   * 대상자 목록은 Excel 업로드 성공 후 조회한다.
   */
  useEffect(() => {
    loadReminderHistory();
  }, [loadReminderHistory]);

  /**
   * 카운트다운 표시를 위해 1초마다 현재 시각 갱신
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /**
   * 특정 건강검진 대상자의 최근 수동 알림 발송 시간 조회
   */
  const getLatestReminderSentAt = (
    checkupId
  ) => {
    const matchingHistory = reminderHistory
      .filter((history) => {
        const sameCheckup =
          Number(history.checkupId) ===
          Number(checkupId);

        const success =
          String(history.status).toUpperCase() ===
          "SUCCESS";

        /*
         * manual 값이 없는 예전 데이터도 고려한다.
         * false인 자동 알림만 제외한다.
         */
        const manual =
          history.manual !== false;

        return sameCheckup && success && manual;
      })
      .sort(
        (first, second) =>
          new Date(second.sentAt).getTime() -
          new Date(first.sentAt).getTime()
      );

    return matchingHistory[0]?.sentAt ?? null;
  };

  /**
   * 대상자별 알림 재발송까지 남은 시간
   */
  const getRemainingCooldown = (
    checkupId
  ) => {
    const latestSentAt =
      getLatestReminderSentAt(checkupId);

    if (!latestSentAt) {
      return 0;
    }

    const sentTime =
      new Date(latestSentAt).getTime();

    if (Number.isNaN(sentTime)) {
      return 0;
    }

    const cooldownEndTime =
      sentTime + REMINDER_COOLDOWN_MS;

    return Math.max(
      cooldownEndTime - now,
      0
    );
  };

  /**
   * Excel 업로드 모달 열기
   */
  const openExcelModal = () => {
    setExcelFile(null);
    setExcelUploadError(null);
    setExcelModalOpen(true);
  };

  /**
   * Excel 업로드 모달 닫기
   */
  const closeExcelModal = () => {
    if (uploadingExcel) {
      return;
    }

    setExcelModalOpen(false);
    setExcelFile(null);
    setExcelUploadError(null);
  };

  /**
   * Excel 파일 선택
   */
  const handleExcelFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    setExcelUploadError(null);

    if (!selectedFile) {
      setExcelFile(null);
      return;
    }

    const lowerFileName =
      selectedFile.name.toLowerCase();

    const isExcelFile =
      lowerFileName.endsWith(".xlsx") ||
      lowerFileName.endsWith(".xls");

    if (!isExcelFile) {
      alert(
        "Excel 파일(.xlsx, .xls)만 선택할 수 있습니다."
      );

      event.target.value = "";
      setExcelFile(null);

      return;
    }

    setExcelFile(selectedFile);
  };

  /**
   * 건강검진 결과 Excel 업로드
   */
  const uploadCheckupExcel = async () => {
    if (!excelFile) {
      alert(
        "업로드할 Excel 파일을 선택해 주세요."
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", excelFile);

    setUploadingExcel(true);
    setExcelUploadError(null);
    setUploadNotice(null);

    try {
      const response = await axios.post(
        `${CHECKUP_API_URL}/excel-upload`,
        formData
      );

      const uploadResult = response.data;

      // 업로드 결과를 반영하기 위해 목록 재조회
      await loadTargetList();
      setHasUploadedExcel(true);

      setUploadNotice({
        message:
          uploadResult.message ||
          "건강검진 결과 Excel 업로드가 완료되었습니다.",

        totalCount:
          uploadResult.totalCount ?? 0,

        successCount:
          uploadResult.successCount ?? 0,

        failureCount:
          uploadResult.failureCount ?? 0,

        errors:
          uploadResult.errors ?? [],
      });

      setExcelModalOpen(false);
      setExcelFile(null);
    } catch (error) {
      console.error(
        "건강검진 Excel 업로드 실패:",
        error
      );

      const serverMessage =
        error.response?.data?.message;

      setExcelUploadError({
        message:
          serverMessage ||
          "Excel 업로드 처리에 실패했습니다.",

        errors:
          error.response?.data?.errors ?? [],
      });
    } finally {
      setUploadingExcel(false);
    }
  };

  /**
   * 수동 알림 모달 열기
   */
  const openReminderModal = (target) => {
    if (target.completed) {
      return;
    }

    const remainingCooldown =
      getRemainingCooldown(target.checkupId);

    if (remainingCooldown > 0) {
      alert(
        `알림 재발송 제한 시간이 남아 있습니다.\n남은 시간: ${formatRemainingTime(
          remainingCooldown
        )}`
      );

      return;
    }

    const confirmed = window.confirm(
      `${target.employeeName}님에게 독려 알림을 발송하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    setSelectedTarget(target);
    setReminderChannel("SMS");

    setReminderContent(
      `${target.employeeName}님, 건강검진을 완료해 주세요.`
    );
  };

  /**
   * 수동 알림 모달 닫기
   */
  const closeReminderModal = () => {
    if (sendingReminder) {
      return;
    }

    setSelectedTarget(null);
    setReminderChannel("SMS");
    setReminderContent("");
  };

  /**
   * 수동 알림 발송 이력 저장
   */
  const sendManualReminder = async () => {
    if (!selectedTarget) {
      return;
    }

    if (!reminderContent.trim()) {
      alert("알림 내용을 입력해 주세요.");
      return;
    }

    /*
     * 모달을 열어둔 동안 다른 요청으로 발송됐을
     * 가능성을 고려하여 발송 직전에도 확인한다.
     */
    const remainingCooldown =
      getRemainingCooldown(
        selectedTarget.checkupId
      );

    if (remainingCooldown > 0) {
      alert(
        `알림 재발송 제한 시간이 남아 있습니다.\n남은 시간: ${formatRemainingTime(
          remainingCooldown
        )}`
      );

      setSelectedTarget(null);

      return;
    }

    setSendingReminder(true);

    try {
      await axios.post(
        `${CHECKUP_API_URL}/reminders/manual`,
        {
          checkupId:
            selectedTarget.checkupId,

          channel:
            reminderChannel,

          content:
            reminderContent.trim(),
        }
      );

      /*
       * 저장된 발송 이력을 다시 조회한다.
       * 조회한 sentAt을 기준으로 카운트다운이 시작된다.
       */
      await loadReminderHistory();

      setNow(Date.now());

      alert(
        "알림 발송 이력이 저장되었습니다.\n3시간 후 다시 발송할 수 있습니다."
      );

      setSelectedTarget(null);
      setReminderChannel("SMS");
      setReminderContent("");
    } catch (error) {
      console.error(
        "수동 알림 발송 실패:",
        error
      );

      alert(
        "알림 발송 처리에 실패했습니다."
      );
    } finally {
      setSendingReminder(false);
    }
  };

  /**
   * 최근 검진 연도 목록
   */
  const yearOptions = Array.from(
    { length: 6 },
    (_, index) =>
      currentYear + 1 - index
  );

  /**
   * 선택한 상태에 따라 화면에 표시할 대상자를 필터링한다.
   */
  const filteredTargetList = targetList.filter(
    (target) => {
      if (statusFilter === "COMPLETED") {
        return target.completed;
      }

      if (statusFilter === "INCOMPLETE") {
        return !target.completed;
      }

      return true;
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 페이지 제목 */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          건강검진 대상자 목록
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          연도별 건강검진 대상자의 수검 상태를
          조회하고 관리합니다.
        </p>
      </section>

      {/* 연도 선택 */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="targetCheckupYear"
            className="font-semibold text-slate-700"
          >
            검진 연도
          </label>

          <select
            id="targetCheckupYear"
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
              setStatusFilter("ALL");
              setUploadNotice(null);
              setTargetList([]);
              setHasUploadedExcel(false);
            }}
            className="
              rounded-lg border border-slate-300
              bg-white px-4 py-2 text-slate-700
              outline-none focus:border-blue-500
              focus:ring-2 focus:ring-blue-100
            "
          >
            {yearOptions.map(
              (optionYear) => (
                <option
                  key={optionYear}
                  value={optionYear}
                >
                  {optionYear}년
                </option>
              )
            )}
          </select>

          <label
            htmlFor="targetStatusFilter"
            className="ml-3 font-semibold text-slate-700"
          >
            검진 상태
          </label>

          <select
            id="targetStatusFilter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="
              rounded-lg border border-slate-300
              bg-white px-4 py-2 text-slate-700
              outline-none focus:border-blue-500
              focus:ring-2 focus:ring-blue-100
            "
          >
            <option value="ALL">
              전체
            </option>

            <option value="COMPLETED">
              검진 완료
            </option>

            <option value="INCOMPLETE">
              검진 미완료
            </option>
          </select>

          <button
            type="button"
            onClick={async () => {
              if (hasUploadedExcel) {
                await loadTargetList();
              }

              await loadReminderHistory();

              setNow(Date.now());
            }}
            disabled={loading}
            className="
              rounded-lg !bg-slate-800
              px-5 py-2 text-sm
              font-semibold !text-white
              transition hover:!bg-slate-700
              disabled:cursor-not-allowed
              disabled:!bg-slate-400
            "
          >
            {loading
              ? "조회 중..."
              : "새로고침"}
          </button>
        </div>
      </section>

      {/* 조회 오류 안내 */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Excel 업로드 성공 결과 */}
      {uploadNotice && (
        <section
          className={`
            mb-6 rounded-xl border p-5
            ${
              uploadNotice.failureCount > 0
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`
                  font-bold
                  ${
                    uploadNotice.failureCount > 0
                      ? "text-amber-800"
                      : "text-emerald-700"
                  }
                `}
              >
                {uploadNotice.message}
              </p>

              <div className="mt-3 flex flex-wrap gap-5 text-sm">
                <span className="text-slate-600">
                  전체{" "}
                  <strong className="text-slate-900">
                    {uploadNotice.totalCount}건
                  </strong>
                </span>

                <span className="text-emerald-700">
                  성공{" "}
                  <strong>
                    {uploadNotice.successCount}건
                  </strong>
                </span>

                <span className="text-red-600">
                  실패{" "}
                  <strong>
                    {uploadNotice.failureCount}건
                  </strong>
                </span>
              </div>

              {uploadNotice.errors.length >
                0 && (
                <ul className="mt-3 list-disc pl-5 text-sm text-red-600">
                  {uploadNotice.errors.map(
                    (uploadError, index) => (
                      <li key={index}>
                        {uploadError}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setUploadNotice(null)
              }
              className="text-xl text-slate-400 hover:text-slate-700"
              aria-label="업로드 결과 닫기"
            >
              ×
            </button>
          </div>
        </section>
      )}

      {/* 검진 대상자 목록 */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              검진 대상자 목록
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              전체 {targetList.length}명 중{" "}
              {filteredTargetList.length}명이 조회되었습니다.
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
                <th className="px-6 py-3">
                  사번
                </th>

                <th className="px-6 py-3">
                  이름
                </th>

                <th className="px-6 py-3">
                  검진 연도
                </th>

                <th className="px-6 py-3">
                  검진일
                </th>

                <th className="px-6 py-3">
                  검진 요약
                </th>

                <th className="px-6 py-3">
                  상태
                </th>

                <th className="px-6 py-3">
                  알림
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    건강검진 대상자를 불러오는 중입니다.
                  </td>
                </tr>
              ) : filteredTargetList.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    {!hasUploadedExcel
                      ? "Excel 파일을 업로드하면 검진 대상자 목록이 표시됩니다."
                      : targetList.length === 0
                        ? "업로드한 파일에 해당 연도의 검진 대상자가 없습니다."
                        : "선택한 상태에 해당하는 대상자가 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredTargetList.map((target) => {
                  const remainingCooldown =
                    getRemainingCooldown(
                      target.checkupId
                    );

                  const coolingDown =
                    remainingCooldown > 0;

                  const buttonDisabled =
                    target.completed ||
                    coolingDown;

                  return (
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
                        {target.checkupDate ??
                          "-"}
                      </td>

                      <td className="px-6 py-4">
                        {target.checkupSummary ??
                          "-"}
                      </td>

                      <td className="px-6 py-4">
                        <CheckupStatusBadge
                          completed={
                            target.completed
                          }
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            type="button"
                            disabled={
                              buttonDisabled
                            }
                            onClick={() =>
                              openReminderModal(
                                target
                              )
                            }
                            title={
                              coolingDown
                                ? "3시간 후 다시 발송할 수 있습니다."
                                : undefined
                            }
                            className={`
                              min-w-24 rounded-lg
                              px-3 py-2 text-sm
                              font-semibold transition
                              ${
                                buttonDisabled
                                  ? `
                                    cursor-not-allowed
                                    !bg-slate-200
                                    !text-slate-500
                                  `
                                  : `
                                    !bg-blue-600
                                    !text-white
                                    hover:!bg-blue-700
                                  `
                              }
                            `}
                          >
                            {target.completed
                              ? "알림 발송"
                              : coolingDown
                                ? formatRemainingTime(
                                    remainingCooldown
                                  )
                                : "알림 발송"}
                          </button>

                          {coolingDown && (
                            <span className="text-xs text-slate-400">
                              재발송 대기
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Excel 파일 업로드 모달 */}
      {excelModalOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-900/50 px-4
          "
        >
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  건강검진 결과 엑셀 업로드
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  건강검진 결과가 입력된 Excel
                  파일을 선택해 주세요.
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

            {/* Excel 형식 안내 */}
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-800">
                Excel 열 순서
              </p>

              <p className="mt-1 text-sm text-blue-700">
                사번 | 이름 | 검진연도 |
                검진일 | 검진요약
              </p>

              <p className="mt-1 text-xs text-blue-600">
                첫 번째 행에는 제목을 입력하고,
                두 번째 행부터 검진 정보를 입력해
                주세요.
              </p>
            </div>

            {/* 첨부파일 선택 */}
            <div className="mt-6">
              <label
                htmlFor="checkupExcelFile"
                className="mb-2 block font-semibold text-slate-700"
              >
                첨부파일
              </label>

              <input
                id="checkupExcelFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={
                  handleExcelFileChange
                }
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
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-700">
                  선택한 파일:
                  <span className="ml-2 font-semibold">
                    {excelFile.name}
                  </span>
                </p>
              </div>
            )}

            {/* 업로드 오류 */}
            {excelUploadError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-700">
                  {excelUploadError.message}
                </p>

                {excelUploadError.errors
                  .length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-sm text-red-600">
                    {excelUploadError.errors.map(
                      (
                        uploadError,
                        index
                      ) => (
                        <li key={index}>
                          {uploadError}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* 모달 버튼 */}
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
                disabled={
                  !excelFile ||
                  uploadingExcel
                }
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
                  ? "업로드 중..."
                  : "업로드"}
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
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800">
              수동 알림 발송
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {selectedTarget.employeeName}
              {" ("}
              {selectedTarget.employeeNo}
              {")"}
            </p>

            <div className="mt-6">
              <label
                htmlFor="reminderChannel"
                className="mb-2 block font-semibold text-slate-700"
              >
                발송 채널
              </label>

              <select
                id="reminderChannel"
                value={reminderChannel}
                onChange={(event) =>
                  setReminderChannel(
                    event.target.value
                  )
                }
                className="
                  w-full rounded-lg
                  border border-slate-300
                  px-4 py-2 outline-none
                  focus:border-blue-500
                "
              >
                <option value="SMS">
                  SMS
                </option>

                <option value="EMAIL">
                  이메일
                </option>
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="reminderContent"
                className="mb-2 block font-semibold text-slate-700"
              >
                알림 내용
              </label>

              <textarea
                id="reminderContent"
                value={reminderContent}
                onChange={(event) =>
                  setReminderContent(
                    event.target.value
                  )
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
              현재는 실제 문자를 전송하지 않고
              알림 발송 이력을 DB에 저장합니다.
            </p>

            <p className="mt-1 text-xs text-amber-600">
              발송 후 3시간 동안 같은 대상자에게
              다시 발송할 수 없습니다.
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
                  ? "처리 중..."
                  : "발송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 남은 밀리초를 HH:MM:SS 형식으로 변환
 */
function formatRemainingTime(
  remainingMilliseconds
) {
  const totalSeconds = Math.max(
    Math.ceil(
      remainingMilliseconds / 1000
    ),
    0
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

/**
 * 검진 완료 여부 표시
 */
function CheckupStatusBadge({ completed }) {
  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600"
        }
      `}
    >
      {completed ? "완료" : "미완료"}
    </span>
  );
}
