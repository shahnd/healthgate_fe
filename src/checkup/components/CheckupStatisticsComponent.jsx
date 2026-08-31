import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/common/styles/ListComponent.css";
import "@/common/styles/Common.css";
import PageHeader from "@/common/components/PageHeader";
import { Stethoscope } from "lucide-react";

const CHECKUP_API_URL =
  "http://localhost:8006/healthgate/checkups";

const UPLOADED_YEARS_KEY = "healthgate.checkup.uploadedYears";

const EMPTY_STATISTICS = {
  checkupYear: 2026,
  totalCount: 0,
  completedCount: 0,
  incompleteCount: 0,
  completionRate: 0,
};

export default function CheckupStatisticsComponent({ dashboard = false }) {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(2026);

  const [statistics, setStatistics] = useState(EMPTY_STATISTICS);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const hasUploadedExcel = hasUploadedYear(year);

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
      setLastUpdatedAt(new Date());
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
    if (hasUploadedExcel) {
      loadStatistics();
      return;
    }

    setStatistics({ ...EMPTY_STATISTICS, checkupYear: year });
    setErrorMessage("");
  }, [hasUploadedExcel, loadStatistics, year]);

  const completionRate = Number(
    statistics.completionRate ?? 0
  );

  if (dashboard) {
    const safeCompletionRate = Math.min(
      Math.max(completionRate, 0),
      100
    );

    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <PageHeader title="건강검진 완료율" description="연도별 건강검진 진행 현황입니다." icon={Stethoscope}/>


          <Select
            value={String(year)}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="w-[120px]" size="sm">
              <SelectValue placeholder="검진 연도" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(
                  { length: 5 },
                  (_, index) => currentYear - 2 + index
                ).map((targetYear) => (
                  <SelectItem key={targetYear} value={String(targetYear)}>
                    {targetYear}년
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {!hasUploadedExcel ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            검진 대상자 목록에서 {year}년 Excel 파일을 업로드하면 통계가 표시됩니다.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-8 px-6 py-8 sm:flex-row sm:justify-center">
              <div
                className="grid size-36 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#2563eb ${safeCompletionRate * 3.6}deg, #e2e8f0 0deg)`,
                }}
              >
                <div className="grid size-28 place-items-center rounded-full bg-white">
                  <strong className="text-3xl font-bold text-slate-900">
                    {safeCompletionRate}%
                  </strong>
                </div>
              </div>

              <div className="w-full max-w-sm">
                <strong className="text-3xl font-bold text-slate-900">
                  {safeCompletionRate}%
                </strong>
                <p className="mt-2 text-sm text-slate-500">
                  {statistics.completedCount ?? 0}명 / {statistics.totalCount ?? 0}명
                </p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${safeCompletionRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-y border-slate-200 bg-slate-50">
              <DashboardCount label="완료" value={statistics.completedCount} color="text-emerald-600" />
              <DashboardCount label="미완료" value={statistics.incompleteCount} color="text-red-500" />
              <DashboardCount label="전체" value={statistics.totalCount} color="text-slate-900" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <p className="text-xs text-slate-500">
                마지막 갱신 {formatDashboardDate(lastUpdatedAt)}
              </p>
              <Button variant="outline" size="sm" render={<Link to="/checkup/targets" />}>
                검진 대상자 목록 보기
              </Button>
            </div>
          </>
        )}

        {errorMessage && (
          <p className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </section>
    );
  }

  return (
    <div className="list-page">
      {/* 페이지 제목 */}
      <div className="page-header">
        <h1>
          건강검진 완료율 통계
        </h1>

        <p>
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

      <div className="list-toolbar">
        <div>
          <Select
            value={String(year)}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="검진 연도" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
              {Array.from(
                { length: 5 },
                (_, index) => currentYear - 2 + index
              ).map((targetYear) => (
                <SelectItem
                  key={targetYear}
                  value={String(targetYear)}
                >
                  {targetYear}년
                </SelectItem>
              ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (hasUploadedExcel) loadStatistics();
            }}
            disabled={loading || !hasUploadedExcel}
          >
            {loading ? "조회 중..." : "새로고침"}
          </Button>
        </div>
      </div>

      {/* 통계 전체 박스 */}
      <section className="list-table-wrapper">
        {!hasUploadedExcel ? (
          <div className="px-6 py-6 text-center text-sm text-slate-500">
            검진 대상자 목록에서 {year}년 Excel 파일을 업로드하면 완료율 통계가 표시됩니다.
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>
    </div>
  );
}

function DashboardCount({ label, value, color }) {
  return (
    <div className="px-3 py-4 text-center [&+&]:border-l [&+&]:border-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <strong className={`mt-1 block text-xl ${color}`}>
        {value ?? 0}명
      </strong>
    </div>
  );
}

function formatDashboardDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
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

function hasUploadedYear(year) {
  const uploadedYears = JSON.parse(
    sessionStorage.getItem(UPLOADED_YEARS_KEY) ?? "[]"
  );

  return uploadedYears.includes(year);
}
