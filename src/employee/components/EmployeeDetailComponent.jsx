import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricLineChart from "../../common/components/MetricLineChart";
import "../styles/EmployeeDetailComponent.css";

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

                const formatted = response2.data.data.map((d) => ({
                    ...d,
                    time: new Date(d.measuredAt).toLocaleTimeString(
                        "ko-KR",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),
                }));

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
        <div className="page employee-detail">

            {/* 페이지 헤더 */}
            <div className="page-header">
                <div>
                    <h2>직원 상세</h2>
                    <p>
                        {data.name} · {data.employeeNumber}
                    </p>
                </div>

                <div className="detail-actions">
                    <button
                        className="btn btn-edit"
                        onClick={() => navigate(`/employees/${id}/edit`)}
                    >
                        편집
                    </button>

                    <button
                        className="btn btn-delete"
                        onClick={handleDelete}
                    >
                        삭제
                    </button>
                </div>
            </div>


            {/* 탭 */}
            <div className="detail-tabs">

                <button
                    className={`detail-tab ${
                        activeTab === "info" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                >
                    직원 정보
                </button>

                <button
                    className={`detail-tab ${
                        activeTab === "health" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("health")}
                >
                    건강 데이터
                </button>

            </div>


            {/* 탭 내용 */}
            <div className="tab-content">

                {activeTab === "info" && (

                    <div className="card employee-info-card">

                        <div className="employee-info-grid">

                            <div className="info-item">
                                <span className="info-label">사번</span>
                                <span className="info-value">
                                    {data.employeeNumber}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">이름</span>
                                <span className="info-value">
                                    {data.name}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">전화번호</span>
                                <span className="info-value">
                                    {data.phone}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">이메일</span>
                                <span className="info-value">
                                    {data.email}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">부서</span>
                                <span className="info-value">
                                    {data.departments?.name}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">직급</span>
                                <span className="info-value">
                                    {data.positions?.name}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">입사일</span>
                                <span className="info-value">
                                    {data.hireDate}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">재직 상태</span>
                                <span className="info-value">
                                    {data.status}
                                </span>
                            </div>

                        </div>

                    </div>

                )}


                {activeTab === "health" && (

                    <div className="chart-grid">

                        <MetricLineChart
                            data={bioData}
                            title="심박수"
                            unit="bpm"
                            yDomain={[40, 160]}
                            lines={[
                                {
                                    dataKey: "heartRate",
                                    name: "심박수",
                                    color: "#ef4444"
                                }
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
                                    color: "#3b82f6"
                                },
                                {
                                    dataKey: "diastolicBp",
                                    name: "최저혈압",
                                    color: "#60a5fa"
                                }
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
                                    color: "#3b82f6"
                                }
                            ]}
                        />
                    </div>

                )}

            </div>

        </div>
    );
}