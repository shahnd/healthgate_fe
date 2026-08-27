import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { selectConsultationApi } from "../api/consultationApi";
import { useAuthStore } from "../../../store/useAuthStore";

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
        "RESERVED": "#919191", // 미완료/예약 (주황빛 등)
        "FINISHED": "#27ae60", // 완료 (초록빛)
        "EXPIRED": "#e74c3c",  // 취소 (붉은빛)
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
        <div>
            <h2>상담일지 상세조회</h2>
            <table>
                <tbody>
                    <tr>
                        <th width="130">신청자</th>
                        <td width="300">{ consultation.employee?.name } </td>
                        <th width="130">부서명</th>
                        <td width="300">{ consultation.employee?.departments?.name }</td>
                    </tr>
                    <tr>
                        <th>예약번호</th>
                        <td>{ consultation.id }</td>
                        <th>직급</th>
                        <td>{ consultation.employee?.positions?.name }</td>
                    </tr>
                    <tr>
                        <th>상담일</th>
                        <td>{ consultation.scheduledDate }</td>
                        <th>시간</th>
                        <td>{ formatScheduledTurn(consultation.scheduledTurn) }</td>
                    </tr>
                    <tr>
                        <th>상담사</th>
                        <td>{ consultation.manager?.name }</td>
                        <th>상담상태</th>
                        <td><b>{ formatStatusWithColor(consultation.status) }</b></td>
                    </tr>
                    <tr>
                        <th>상담내용</th>
                        <td colSpan={ 3 }>{ (!consultation.content || consultation.content === "")
                                            ? <span style={{ color : "#BBBBBB" }}>일지를 작성해주세요.</span>
                                            : consultation.content }
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {role === "HEALTH_ADMIN" && (
                    <>
                        <button type="button"
                                onClick={ () => { navigate(`/consultation/${id}`); } }>
                                    { (!consultation.content || consultation.content === "") ? "일지 작성" : "일지 수정" }
                        </button>
                    </>
                )}
                &nbsp;&nbsp;
                <button type="button"
                        onClick={ () => { navigate(`/consultation/list`); } }>목록으로</button>
            </div>
        </div>
    );
}
