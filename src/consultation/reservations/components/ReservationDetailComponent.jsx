import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectReservationApi, cancelReservationApi } from "../api/reservationApi";
import { useAuthStore } from "@/store/useAuthStore";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/DetailComponent.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function ReservationDetailComponent() {

    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 유저 정보 변수
    const user = useAuthStore(state => state.user);
    const role = user?.role;
    const loginUserId = user?.id;

    // 출력 데이터 변수
    const [reservation, setReservation] = useState({
        employee : {
            id : id,
            name : "",
            department : { name : "" },
            position : { name : "" },
            phone : ""
        },
        id : id,
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        status : "",
        createAt : ""
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

    // 페이지 최초 진입 - 예약 단건 조회
    useEffect(() => {
        // 상세 정보 조회
        const selectReservation = async () => {

            if(!id) return;

            try {
                
                const response = await selectReservationApi(id);

                // 권한 체크
                if (role !== "HEALTH_ADMIN") {
                    // 상담사 아닐 경우 조회 시
                    if (response.data.employee?.id != loginUserId) {
                        // 본인이 아니면 접근 제한
                        alert("접근 권한이 없습니다.")
                        navigate("/consultation/list");
                        return;
                    }
                }

                if(response.data != "") {

                    setReservation(response.data);
                } else {

                    alert("예약이 없거나 취소되었습니다.");
                }
                
            } catch (error) {
                console.log("예약 상세 조회 통신 실패" + error);

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

        selectReservation();
    }, [id, loginUserId]);

    const cancelReservation = async () => {

        if(!id) return;

        try {
            
            if(confirm("예약을 취소하시겠습니까?")) {

            const response = await cancelReservationApi(id);

            if(response.data == "success") {

                alert("상담 예약이 취소되었습니다");
                navigate("/consultation/reservation/list");

            } else {

                alert("예약 취소가 실패되었습니다. 다시 시도해주세요.");
            }
        }

        } catch (error) {
            console.log("예약 취소 ajax 통신 실패" + error);
        }
    }

    return(
        <div className="detail-page">
            <PageHeader title="상담 예약 상세 조회" description="예약된 상담을 조회합니다." icon={MessageCircle}/>
            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>상담 예약 정보</CardTitle>
                    <CardDescription>상담 예약 정보를 확인해 주세요.</CardDescription>
                </CardHeader>

                <CardContent>
                    <dl>
                        <div>
                            <dt>신청자</dt>
                            <dd>{reservation.employee?.name}</dd>
                        </div>

                        <div>
                            <dt>부서명</dt>
                            <dd>{reservation.employee?.departments?.name || "-"}</dd>
                        </div>

                        <div>
                            <dt>직급</dt>
                            <dd>{reservation.employee?.positions?.name || "-"}</dd>
                        </div>

                        <div>
                            <dt>연락처</dt>
                            <dd>{reservation.employee?.phone || "-"}</dd>
                        </div>

                        <div>
                            <dt>상담일</dt>
                            <dd>{reservation.scheduledDate}</dd>
                        </div>

                        <div>
                            <dt>시간</dt>
                            <dd>{formatScheduledTurn(reservation.scheduledTurn)}</dd>
                        </div>

                        <div>
                            <dt>신청사유</dt>
                            <dd>{reservation.reason}</dd>
                        </div>
                    </dl>
                </CardContent>

                <CardFooter>
                    <Button
                        size="lg" className="cursor-pointer"
                        type="button"
                        onClick={() => {
                            navigate(`/consultation/reservation/${id}`);
                        }}
                    >
                        예약 수정
                    </Button>

                    <Button
                        size="lg" className="cursor-pointer"
                        type="button"
                        variant="outline"
                        onClick={cancelReservation}
                    >
                        예약 취소
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};