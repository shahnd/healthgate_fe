import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

const CHECKUP_API_URL =
  "http://localhost:8006/healthgate/checkups";

export default function CheckupReminderHistoryComponent() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 화면 표시용 필터
  const [channelFilter, setChannelFilter] =
    useState("ALL");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  /**
   * 알림 발송 이력 조회
   */
  const loadReminderHistory =
    useCallback(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `${CHECKUP_API_URL}/reminders/history`
        );

        setHistoryList(response.data ?? []);
      } catch (error) {
        console.error(
          "알림 발송 이력 조회 실패:",
          error
        );

        setErrorMessage(
          "알림 발송 이력을 불러오지 못했습니다."
        );

        setHistoryList([]);
      } finally {
        setLoading(false);
      }
    }, []);

  /**
   * 화면 최초 출력 시 이력 조회
   */
  useEffect(() => {
    loadReminderHistory();
  }, [loadReminderHistory]);

  /**
   * 선택한 채널과 발송 구분으로 목록 필터링
   */
  const filteredHistoryList =
    historyList.filter((history) => {
      const channelMatched =
        channelFilter === "ALL" ||
        history.channel === channelFilter;

      const historyType =
        history.manual ? "MANUAL" : "AUTOMATIC";

      const typeMatched =
        typeFilter === "ALL" ||
        historyType === typeFilter;

      return channelMatched && typeMatched;
    });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 페이지 제목 */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          알림 발송 이력
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          건강검진 대상자에게 발송한 알림 내역을
          확인합니다.
        </p>
      </section>

      {/* 필터 및 새로고침 */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          {/* 채널 필터 */}
          <div>
            <label
              htmlFor="historyChannelFilter"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              발송 채널
            </label>

            <select
              id="historyChannelFilter"
              value={channelFilter}
              onChange={(event) =>
                setChannelFilter(event.target.value)
              }
              className="
                min-w-40 rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                text-slate-700 outline-none
                focus:border-blue-500
              "
            >
              <option value="ALL">
                전체
              </option>

              <option value="SMS">
                SMS
              </option>

              <option value="EMAIL">
                이메일
              </option>
            </select>
          </div>

          {/* 발송 구분 필터 */}
          <div>
            <label
              htmlFor="historyTypeFilter"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              발송 구분
            </label>

            <select
              id="historyTypeFilter"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="
                min-w-40 rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                text-slate-700 outline-none
                focus:border-blue-500
              "
            >
              <option value="ALL">
                전체
              </option>

              <option value="MANUAL">
                수동
              </option>

              <option value="AUTOMATIC">
                자동
              </option>
            </select>
          </div>

          {/* 새로고침 */}
          <button
            type="button"
            onClick={loadReminderHistory}
            disabled={loading}
            className="
              rounded-lg !bg-slate-800
              px-5 py-2 font-semibold
              !text-white transition
              hover:!bg-slate-700
              disabled:cursor-not-allowed
              disabled:!bg-slate-400
            "
          >
            {loading ? "조회 중..." : "새로고침"}
          </button>
        </div>
      </section>

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* 발송 이력 테이블 */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">
            건강검진 알림 발송 내역
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            총 {filteredHistoryList.length}건의 발송 이력이
            조회되었습니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-5 py-3">
                  번호
                </th>

                <th className="px-5 py-3">
                  검진 ID
                </th>

                <th className="px-5 py-3">
                  채널
                </th>

                <th className="px-5 py-3">
                  메시지 내용
                </th>

                <th className="px-5 py-3">
                  발송 일시
                </th>

                <th className="px-5 py-3">
                  상태
                </th>

                <th className="px-5 py-3">
                  구분
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    알림 발송 이력을 불러오는 중입니다.
                  </td>
                </tr>
              ) : filteredHistoryList.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    조건에 해당하는 알림 발송 이력이
                    없습니다.
                  </td>
                </tr>
              ) : (
                filteredHistoryList.map((history) => (
                  <tr
                    key={history.reminderId}
                    className="
                      border-t border-slate-100
                      text-sm text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <td className="px-5 py-4">
                      {history.reminderId}
                    </td>

                    <td className="px-5 py-4">
                      {history.checkupId}
                    </td>

                    <td className="px-5 py-4">
                      <ChannelBadge
                        channel={history.channel}
                      />
                    </td>

                    <td className="max-w-md px-5 py-4">
                      <p className="whitespace-pre-wrap break-words">
                        {history.content}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {formatDateTime(history.sentAt)}
                    </td>

                    <td className="px-5 py-4">
                      <ReminderStatusBadge
                        status={history.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <ReminderTypeBadge
                        manual={history.manual}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 현재 구현 상태 안내 */}
      <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="text-sm text-blue-700">
          현재 알림 기능은 실제 SMS 또는 이메일을
          전송하는 단계가 아니라, 발송 요청 결과를
          알림 이력 테이블에 저장하는 방식입니다.
        </p>
      </section>
    </div>
  );
}

/**
 * 발송 채널 표시
 */
function ChannelBadge({ channel }) {
  const channelName =
    getChannelName(channel);

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          channel === "EMAIL"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
        }
      `}
    >
      {channelName}
    </span>
  );
}

/**
 * 발송 성공 여부 표시
 */
function ReminderStatusBadge({ status }) {
  const successful = status === "SUCCESS";

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          successful
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600"
        }
      `}
    >
      {successful ? "성공" : status}
    </span>
  );
}

/**
 * 수동·자동 발송 구분 표시
 */
function ReminderTypeBadge({ manual }) {
  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          manual
            ? "bg-slate-200 text-slate-700"
            : "bg-amber-100 text-amber-700"
        }
      `}
    >
      {manual ? "수동" : "자동"}
    </span>
  );
}

/**
 * 발송 채널을 한글로 변환
 */
function getChannelName(channel) {
  if (channel === "SMS") {
    return "SMS";
  }

  if (channel === "EMAIL") {
    return "이메일";
  }

  return channel ?? "-";
}

/**
 * 날짜와 시간을 화면 형식으로 변환
 */
function formatDateTime(dateTime) {
  if (!dateTime) {
    return "-";
  }

  return dateTime
    .replace("T", " ")
    .split(".")[0];
}