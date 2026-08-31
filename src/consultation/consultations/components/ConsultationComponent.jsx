import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { saveConsultationApi, selectConsultationApi } from "../api/consultationApi";
import { useAuthStore } from "../../../store/useAuthStore";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/DetailComponent.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function ConsultationComponent () {
    // ============================ 객체 및 보조 함수
    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 권한 변수
    const authStore = useAuthStore();
    const user = authStore?.user;
    const role = user?.role;
    const loginUserId = user?.id;

    // 출력 데이터 rorcp
    const [consultation, setConsultation] = useState({
        employee : {
            id : "",
            name : "",
            departments : { name : "" },
            positions : { name : "" }
        },
        id : "",
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        content : "",
        status : "",
        createdAt : "",
        consultatedAt : ""
    });

    // 수정모드 판별용 변수
    const isEditMode = consultation.content && consultation.content.trim() != "";

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

    // ============================ 동작용 함수
    // 페이지 최초 진입 - 상담 내역 조회
    useEffect(() => {

        // 권한 체크
        if (role != "HEALTH_ADMIN") {
            alert("접근 권한이 없습니다.")
            navigate("/consultation/list");
            return;
        }

        // 상담 내역 조회
        const selectConsultation = async () => {
            try {

                const response = await selectConsultationApi(id);
                console.log(response.data);
                setConsultation(response.data);
            } catch (error) {
                console.log("상담일지 조회용 통신 실패" + error);
            }
        }
        selectConsultation();
    }, [id, role, navigate]);

    // 작성/수정하기 버튼 클릭 시
    const saveConsultation = async e => {
        e.preventDefault();

        try {
            const saveData = {
                ...consultation,
                manager : { id : loginUserId },
                consultatedAt : new Date().toISOString()
            };

            console.log("최종 데이터 : ", saveData);

            const response = await saveConsultationApi(id, saveData);

            if(response.data == "success") {

                const msg = isEditMode ? "일지를 수정했습니다." : "일지를 등록했습니다.";
                alert(msg);
                navigate("/consultation/list")
            } else {

                alert("일지 작성에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.log("일지 등록/수정 통신 실패" + error);
        }
    }

    // 변동 적용
    const handleChange = e => {
        const newConsultation = {...consultation};
        newConsultation[e.target.name] = e.target.value;
        setConsultation(newConsultation);
    }

    return(
        <div className="detail-page">
            <PageHeader title="상담일지 작성" description="상담일지를 작성합니다." icon={MessageCircle}/>
            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>상담 일지</CardTitle>
                    <CardDescription>상담 내용을 작성하고 상담 상태를 변경해 주세요.</CardDescription>
                </CardHeader>

                <form className="consultation-form">
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
                                <dd>{id}</dd>
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
                                <dd>{user?.name || ''}</dd>
                            </div>

                            <div>
                                <dt>상담상태</dt>
                                <dd>
                                    <select
                                        name="status"
                                        value={consultation.status}
                                        onChange={handleChange}
                                    >
                                        <option value="RESERVED">미완료</option>
                                        <option value="FINISHED">완료</option>
                                        <option value="EXPIRED">취소</option>
                                    </select>
                                </dd>
                            </div>

                            <div>
                                <dt>상담내용</dt>
                                <dd>
                                    <textarea
                                        name="content"
                                        onChange={handleChange}
                                        value={consultation.content}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="primary-button"
                            type="submit"
                            onClick={saveConsultation}
                        >
                            {isEditMode ? "수정하기" : "작성하기"}
                        </Button>

                        <Button
                            className="primary-button"
                            type="button"
                            variant="outline"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            뒤로가기
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
