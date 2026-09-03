import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { saveConsultationApi, selectConsultationApi } from "../api/consultationApi";
import { useAuthStore } from "../../../store/useAuthStore";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/DetailComponent.css";
import { Card, CardContent,CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea"

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

    // content 변경 판별용
    const [isModified, setIsModified] = useState("");

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
                setIsModified(response.data.content || "");
            } catch (error) {
                console.log("상담일지 조회용 통신 실패" + error);
            }
        }
        selectConsultation();
    }, [id, role, navigate]);

    // 작성/수정하기 버튼 클릭 시
    const saveConsultation = async e => {
        e.preventDefault();

        // 상담 내용 입력 검증
        if(!consultation.content || !consultation.content.trim()) {
            alert("상담 내용을 입력해주세요.");
            return;
        }

        // 미완료 상태 저장 방지
        if(consultation.status === "RESERVED") {
            alert("상담 상태를 완료 또는 취소로 변경해주세요.");
            return;
        }

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
                navigate(`/consultation/detail/${id}`)
            } else {

                alert("일지 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        } catch (error) {
            alert("일지 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
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

                            <div style={{ gridColumn: "1 / -1" }}>
                                <dt>상담내용</dt>
                                <dd>
                                    <Textarea
                                        name="content"
                                        style={{ resize : "none", height : "265px"}}
                                        onChange={handleChange}
                                        value={consultation.content}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button
                            size="lg" className="cursor-pointer"
                            type="submit"
                            onClick={saveConsultation}
                        >
                            {isEditMode ? "수정하기" : "작성하기"}
                        </Button>

                        <Button
                            size="lg" className="cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={() => {
                                // 저장 안 됨 안내창 추가
                                const isDirty = consultation !== isModified;
                                if(isDirty && !confirm("작성중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?")) {
                                    return;
                                }
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
