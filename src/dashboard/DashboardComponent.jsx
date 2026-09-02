import PageHeader from "@/common/components/PageHeader";
import CheckupStatisticsComponent from "../checkup/components/CheckupStatisticsComponent";
import "@/common/styles/ListComponent.css";
import { LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NoticeCardComponent from "./NoticeCardComponent";
import TodayConsultationCard from "./TodayConsultationCard";
import { useEffect, useState } from "react";
import { selectNoticeListApi } from "@/notice/api/NoticeApi";
import { selectConsultationListApi } from "@/consultation/consultations/api/consultationApi";
import axios from "axios";

export default function DashboardComponent() {
    const total = 143;
    const [attendanceCount, setAttendanceCount] = useState({
        attendanceCount: 0,
        denyCount: 0,
        warnCount: 0
    });
    const data = [
        { label: "출근", count: attendanceCount.attendanceCount, color: "bg-emerald-500" },
        { label: "주의", count: attendanceCount.warnCount, color: "bg-amber-500" },
        { label: "출근거부", count: attendanceCount.denyCount, color: "bg-red-500" },
    ];

    const [notices, setNotices] = useState();
    const [consultation, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await selectNoticeListApi(1);
                const list = res.data.list ?? [];

                setNotices(
                    list.slice(0, 5).map((n) => ({
                        id: n.noticeId,
                        title: n.title,
                        createdAt: n.createdAt?.slice(5, 10).replace("-", "."),
                    }))
                );
            } catch (err) {
                setNotices([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchTodayConsultations = async () => {
            try {
                const today = new Date();
                const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
                const todayStr = today.toISOString().slice(0, 10); // "2026-09-01"

                const res = await selectConsultationListApi({
                    startMonth: yearMonth,
                    endMonth: yearMonth,
                });

                const list = res.data.list ?? res.data.content ?? res.data ?? [];

                const todayOnly = list.filter(
                    (c) => c.scheduledDate?.slice(0, 10) === todayStr
                );

                setConsultations(
                    todayOnly.map((c) => ({
                        id: c.consultationId,
                        employeeName: c.employeeName,
                        time: c.scheduledTurn,
                        status: c.status,
                    }))
                );
            } catch (err) {
                console.error("금일 상담 조회 실패", err);
                setConsultations([]);
            }
        };

        const fetchAttendanceCount = async () => {
            try {
                const response = await axios.get("http://localhost:8006/healthgate/dattendances")

                console.log(response.data);

                setAttendanceCount(response.data);

            } catch(error) {
                console.log("출근자 조회 실패")
            }
        }

        fetchNotices();
        fetchTodayConsultations();
        fetchAttendanceCount();
    }, []);

    return (
        <div className="list-page gap-5">
            <PageHeader title="대시보드" description="주요 건강 관리 현황을 확인합니다." icon={LayoutDashboard}/>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>출근자 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.map(({ label, count, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium">{count}명</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full ${color}`}
                                style={{ width: `${(count / total) * 100}%` }}
                            />
                            </div>
                        </div>
                        ))}
                    </CardContent>
                </Card>
            <CheckupStatisticsComponent dashboard />
            <NoticeCardComponent
                    notices={notices}
                />
                <TodayConsultationCard
                    consultations={consultation}
                />

            </div>
        </div>
    );
}
