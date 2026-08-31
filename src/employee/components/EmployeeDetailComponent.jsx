import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricLineChart from "../../common/components/MetricLineChart";
import "@/common/styles/DetailComponent.css";
import { Button } from "@/components/ui/button";
import "@/common/styles/Common.css"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/common/components/PageHeader";
import { UserIcon } from "lucide-react";


export default function EmployeeDetailComponent() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [bioData, setBioData] = useState([]);

    // 현재 선택된 탭
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {

        const getEmployee = async () => {

            try {
                const response = await axios.get(
                    `http://localhost:8006/healthgate/employees/${id}`
                );

                setData(response.data.data);

                const response2 = await axios.get(
                    `http://localhost:8006/healthgate/biometrics/${id}`
                );

                const formatted = response2.data.data.map((d) => {
                const dateObj = new Date(d.measuredAt);
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const dd = String(dateObj.getDate()).padStart(2, "0");

                return {
                    ...d,
                    time: `${mm}/${dd}`, // "08/27"
                    fullTime: new Date(d.measuredAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    }),
                };
                });

                setBioData(formatted);

            } catch (error) {
                console.log("직원정보 상세 조회 통신 실패");
            }
        };

        getEmployee();

    }, [id]);


    const handleDelete = async () => {

        try {

            await axios.delete(
                `http://localhost:8006/healthgate/employees/${id}`
            );

            alert("삭제 성공");

            navigate("/employees");

        } catch (error) {
            console.log("직원정보 삭제 통신 실패");
        }
    };


    return (
        <div className="detail-page">
                <PageHeader title="직원 정보 조회" description={`${data.employeeNumber} | ${data.name}`} icon={UserIcon}/>
                <nav 
                    aria-label="직원 상세 메뉴" 
                    className="flex gap-1 -mt-[calc(1rem+1px)] relative z-10 border-b border-transparent"
                >
                    <button
                    aria-selected={activeTab === "info"}
                    onClick={() => setActiveTab("info")}
                    className={`px-4 py-[0.625rem] text-sm font-medium bg-transparent cursor-pointer border-b-2 transition-colors ${
                        activeTab === "info"
                        ? "text-[var(--foreground)] border-[var(--primary)]"
                        : "text-[var(--muted-foreground)] border-transparent"
                    }`}
                    >
                    기본 정보
                    </button>
                    <button
                    aria-selected={activeTab === "health"}
                    onClick={() => setActiveTab("health")}
                    className={`px-4 py-[0.625rem] text-sm font-medium bg-transparent cursor-pointer border-b-2 transition-colors ${
                        activeTab === "health"
                        ? "text-[var(--foreground)] border-[var(--primary)]"
                        : "text-[var(--muted-foreground)] border-transparent"
                    }`}
                    >
                    건강 데이터
                    </button>
                </nav>



            <div className="detail-page">
                {activeTab === "info" && (
                    <section data-detail-section="info">
                        <Card className="detail-info-card">
                            <CardHeader>
                                <CardTitle>기초정보</CardTitle>
                                <CardDescription>직원 기초정보</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl>
                                <div>
                                    <dt>사번</dt>
                                    <dd>{data.employeeNumber}</dd>
                                </div>
                                <div>
                                    <dt>이름</dt>
                                    <dd>{data.name}</dd>
                                </div>
                                <div>
                                    <dt>부서</dt>
                                    <dd>{data.departments?.name || "부서 미지정"}</dd>
                                </div>
                                <div>
                                    <dt>직급</dt>
                                    <dd>{data.positions?.name || "직급 미지정"}</dd>
                                </div>
                                <div>
                                    <dt>이메일</dt>
                                    <dd>{data.email || "-"}</dd>
                                </div>
                                <div>
                                    <dt>전화번호</dt>
                                    <dd>{data.phone || "-"}</dd>
                                </div>
                                <div>
                                    <dt>입사일</dt>
                                    <dd>{data.hireDate || "-"}</dd>
                                </div>
                                <div>
                                    <dt>재직 상태</dt>
                                    <dd>{data.status || "-"}</dd>
                                </div>
                                </dl>
                            </CardContent>
                            <CardFooter>
                                <Button size="lg" className="cursor-pointer" onClick={() => navigate(`/employees/${id}/edit`)}>
                                    편집
                                </Button>
                                <Button size="lg" variant="secondary" className="cursor-pointer" onClick={handleDelete}>
                                    삭제
                                </Button>
                            </CardFooter>
                        </Card>
                    </section>
                )}

                {activeTab === "health" && (
                    <section data-detail-section="health">
                        {/* 기존 MetricLineChart 3개 */}
                        <MetricLineChart
                            data={bioData}
                            title="심박수"
                            unit="bpm"
                            yDomain={[40, 160]}
                            lines={[
                                {
                                    dataKey: "heartRate",
                                    name: "심박수",
                                    color: "#ef4444",
                                },
                            ]}
                        />

                        <MetricLineChart
                            data={bioData}
                            title="혈압"
                            unit="mmHg"
                            yDomain={[40, 160]}
                            lines={[
                                {
                                    dataKey: "systolicBp",
                                    name: "최고혈압",
                                    color: "#3b82f6",
                                },
                                {
                                    dataKey: "diastolicBp",
                                    name: "최저혈압",
                                    color: "#60a5fa",
                                },
                            ]}
                        />

                        <MetricLineChart
                            data={bioData}
                            title="체온"
                            unit="℃"
                            yDomain={[32, 42]}
                            lines={[
                                {
                                    dataKey: "temperature",
                                    name: "체온",
                                    color: "#3b82f6",
                                },
                            ]}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}