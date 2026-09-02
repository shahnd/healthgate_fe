import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { selectConsultationApi } from "../api/consultationApi";
import { useAuthStore } from "../../../store/useAuthStore";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/DetailComponent.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function ConsultationDetailComponent () {

    // ============================ 객체 및 보조 함수
    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 유저 정보 변수
    const user = useAuthStore(state => state.user);
    const role = user?.role;
    const loginUserId = user?.id;

    // 출력 데이터 변수
    const [consultation, setConsultation] = useState({
        employee : {
            id : "",
            name : "",
            departments : { name : "" },
            positions : { name : "" }
        },
        id : id,
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        content : "",
        status : "",
        createdAt : "",
        consultatedAt : ""
    });

    // 차시 -> 시간 매핑
    const turnTimeMap = {
        "T1": "10:00 ~ 10:50",
        "T2": "11:00 ~ 11:50",
        "T3": "13:00 ~ 13:50",
        "T4": "14:00 ~ 14:50",
        "T5": "15:00 ~ 15:50",
        "T6": "16:00 ~ 16:50",
    };

    // TN -> N차 + turnTimeMap
    const formatScheduledTurn = turn => {
        if (!turn) return "-";
        const turnNumber = turn.replace("T", "");
        const timeRange = turnTimeMap[turn] || "";

        return timeRange ? `${turnNumber}차 ${timeRange}` : "-";
    }

    // 상태값 매핑
    const statusMap = {
        "RESERVED" : "미완료",
        "FINISHED" : "완료",
        "EXPIRED" : "취소"
    };

    // 상태별 색상 매핑
    const statusColorMap = {
        "RESERVED": "#919191",
        "FINISHED": "#27ae60",
        "EXPIRED": "#e74c3c",
    };

    // 상태값 -> 한글 변환
    const formatStatus = (status) => {
        return statusMap[status] || status;
    }

    // 한글 변환 + 색상 적용
    const formatStatusWithColor = (status) => {
        return (
            <span style={{ color: statusColorMap[status] || "#000000", fontWeight: "bold" }}>
                { formatStatus(status) }
            </span>
        );
    };

    // ============================ 동작용 함수
    // 페이지 최초 진입 - 상담 내역 조회
    useEffect(() => {

        const selectConsultation = async () => {
            try {

                const response = await selectConsultationApi(id);

                // 권한 체크
                if (role != "HEALTH_ADMIN") {
                    // 상담사 아닐 경우 조회 시
                    if (response.data.employee?.id != loginUserId) {
                        // 본인이 아니면 접근 제한
                        alert("접근 권한이 없습니다.")
                        navigate("/consultation/list");
                        return;
                    }
                }

                setConsultation(response.data);
                
            } catch (error) {
                console.log("상담일지 조회용 통신 실패" + error);

                if(error.response && error.response.status === 403) {

                    alert("접근 권한이 없습니다.");
                    navigate("/consultation/list");
                } else if(error.response && error.response.status === 404) {

                    alert("숨겨졌거나 삭제된 데이터 입니다.");
                    navigate("/consultation/list");
                } else {

                    alert("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.")
                }
            }
        }
        selectConsultation();
    }, [id, role, loginUserId, navigate]);

    return(
        <div className="detail-page">
            <PageHeader title="상담일지 상세조회" description="상담일지의 자세한 내용을 조회합니다." icon={MessageCircle}/>

            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>상담 정보</CardTitle>
                    <CardDescription>상담 신청 정보</CardDescription>
                </CardHeader>

                <CardContent>
                    <dl>
                        <div>
                            <dt>신청자</dt>
                            <dd>{consultation.employee?.name}</dd>
                        </div>

                        <div>
                            <dt>부서명</dt>
                            <dd>{consultation.employee?.departments?.name}</dd>
                        </div>

                        <div>
                            <dt>예약번호</dt>
                            <dd>{consultation.id}</dd>
                        </div>

                        <div>
                            <dt>직급</dt>
                            <dd>{consultation.employee?.positions?.name}</dd>
                        </div>

                        <div>
                            <dt>상담일</dt>
                            <dd>{consultation.scheduledDate}</dd>
                        </div>

                        <div>
                            <dt>시간</dt>
                            <dd>{formatScheduledTurn(consultation.scheduledTurn)}</dd>
                        </div>

                        <div>
                            <dt>상담사</dt>
                            <dd>{consultation.manager?.name}</dd>
                        </div>

                        <div>
                            <dt>상담상태</dt>
                            <dd>
                                <b>{formatStatusWithColor(consultation.status)}</b>
                            </dd>
                        </div>

                        <div>
                            <dt>상담내용</dt>
                            <dd>
                                {(!consultation.content || consultation.content === "")
                                    ? <span style={{ color: "#BBBBBB" }}>일지를 작성해주세요.</span>
                                    : consultation.content}
                            </dd>
                        </div>
                    </dl>
                </CardContent>

                <CardFooter>
                    {role === "HEALTH_ADMIN" && (
                        <Button
                            size="lg" className="cursor-pointer"
                            type="button"
                            onClick={() => {
                                navigate(`/consultation/${id}`);
                            }}
                        >
                            {(!consultation.content || consultation.content === "")
                                ? "일지 작성"
                                : "일지 수정"}
                        </Button>
                    )}

                    <Button
                        size="lg" className="cursor-pointer"
                        type="button"
                        variant="outline"
                        onClick={() => {
                            navigate(`/consultation/list`);
                        }}
                    >
                        목록으로
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
