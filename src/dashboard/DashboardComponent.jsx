import PageHeader from "@/common/components/PageHeader";
import CheckupStatisticsComponent from "../checkup/components/CheckupStatisticsComponent";
import "@/common/styles/ListComponent.css";
import { LayoutDashboard } from "lucide-react";

export default function DashboardComponent() {
    return (
        <div className="list-page">
            <PageHeader title="대시보드" description="주요 건강 관리 현황을 확인합니다." icon={LayoutDashboard}/>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="hidden lg:block" aria-hidden="true" />
                <CheckupStatisticsComponent dashboard />
            </div>
        </div>
    );
}
