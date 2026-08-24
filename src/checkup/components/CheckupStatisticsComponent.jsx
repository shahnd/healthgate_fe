import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const CHECKUP_API_URL =
  "http://localhost:8006/healthgate/checkups";

export default function CheckupStatisticsComponent() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(2026);

  const [statistics, setStatistics] = useState({
    checkupYear: 2026,
    totalCount: 0,
    completedCount: 0,
    incompleteCount: 0,
    completionRate: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 건강검진 완료율 통계 조회
   */
  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${CHECKUP_API_URL}/statistics`,
        {
          params: {
            year,
          },
        }
      );

      setStatistics(response.data);
    } catch (error) {
      console.error(
        "건강검진 완료율 통계 조회 실패:",
        error
      );

      setErrorMessage(
        "건강검진 완료율 통계를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const completionRate = Number(
    statistics.completionRate ?? 0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          건강검진 완료율 통계
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          연도별 건강검진 대상자와 검진 완료율을
          확인합니다.
        </p>
      </div>

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* 통계 전체 박스 */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* 박스 상단 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              검진 완료율 통계
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              선택한 연도의 건강검진 진행 현황입니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="checkupYear"
              className="text-sm font-semibold text-slate-700"
            >
              검진 연도
            </label>

            <select
              id="checkupYear"
              value={year}
              onChange={(event) =>
                setYear(Number(event.target.value))
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {Array.from(
                { length: 5 },
                (_, index) => currentYear - 2 + index
              ).map((targetYear) => (
                <option
                  key={targetYear}
                  value={targetYear}
                >
                  {targetYear}년
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadStatistics}
              disabled={loading}
              className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "조회 중..." : "새로고침"}
            </button>
          </div>
        </div>

        {/* 통계 카드 4개 */}
        <div
          className="p-6"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <StatisticsItem
            title="전체 대상자"
            value={statistics.totalCount}
            unit="명"
            valueColor="#0f172a"
            backgroundColor="#f8fafc"
            borderColor="#e2e8f0"
          />

          <StatisticsItem
            title="검진 완료"
            value={statistics.completedCount}
            unit="명"
            valueColor="#059669"
            backgroundColor="#ecfdf5"
            borderColor="#a7f3d0"
          />

          <StatisticsItem
            title="검진 미완료"
            value={statistics.incompleteCount}
            unit="명"
            valueColor="#ef4444"
            backgroundColor="#fef2f2"
            borderColor="#fecaca"
          />

          <StatisticsItem
            title="완료율"
            value={completionRate}
            unit="%"
            valueColor="#2563eb"
            backgroundColor="#eff6ff"
            borderColor="#bfdbfe"
          />
        </div>

        {/* 진행률 */}
        <div className="border-t border-slate-200 px-6 py-5">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                건강검진 진행 현황
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                전체 대상자 중 검진 완료자의 비율입니다.
              </p>
            </div>

            <strong className="text-2xl text-blue-600">
              {completionRate}%
            </strong>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(completionRate, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-sm text-slate-500">
            <span>
              완료 {statistics.completedCount ?? 0}명
            </span>

            <span>
              전체 {statistics.totalCount ?? 0}명
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * 통계 카드
 */
function StatisticsItem({
  title,
  value,
  unit,
  valueColor,
  backgroundColor,
  borderColor,
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
        minWidth: 0,
      }}
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-1">
        <strong
          className="text-3xl font-bold"
          style={{ color: valueColor }}
        >
          {value ?? 0}
        </strong>

        <span
          className="pb-1 text-sm font-semibold"
          style={{ color: valueColor }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}