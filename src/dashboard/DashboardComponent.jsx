import CheckupStatisticsComponent from "../checkup/components/CheckupStatisticsComponent";

export default function DashboardComponent() {
    return (
        <div className="w-full p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
                <p className="mt-1 text-sm text-slate-500">주요 건강관리 현황을 확인합니다.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="hidden lg:block" aria-hidden="true" />
                <CheckupStatisticsComponent dashboard />
            </div>
        </div>
    );
}
