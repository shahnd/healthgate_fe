import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { selectConsultationApi } from "../api/consultationApi";

export default function ConsultationDetailComponent () {

    // ============================ 객체 및 보조 함수
    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 출력 데이터 변수
    const [consultation, setConsultation] = useState({
        employee : {
            id : "",
            name : "",
            department : { name : "" },
            position : { name : "" }
        },
        id : id,
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        status : "",
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

    // 상태값 -> 한글 변환
    const formatStatus = (status) => {
        return statusMap[status] || status;
    }

    // ============================ 동작용 함수
    // 페이지 최초 진입 - 상담 내역 조회
    useEffect(() => {
        const selectConsultation = async () => {
            try {

                const response = await selectConsultationApi(id);
                setConsultation(response.data);
                
            } catch (error) {
                console.log("상담일지 조회용 통신 실패" + error);
            }
        }
        selectConsultation();
    }, [id]);

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
                        <td>{ consultation.employee.positions?.name }</td>
                    </tr>
                    <tr>
                        <th>상담일</th>
                        <td>{ consultation.scheduledDate }</td>
                        <th>시간</th>
                        <td>{ formatScheduledTurn(consultation.scheduledTurn) }</td>
                    </tr>
                    <tr>
                        <th>상담사</th>
                        <td>{ consultation.manager }</td>
                        <th>상담상태</th>
                        <td><b>{ formatStatus(consultation.status) }</b></td>
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
                <button type="button"
                        onClick={ () => { navigate(`/consultation/${id}`); } }>
                            { (!consultation.content || consultation.content === "") ? "일지 작성" : "일지 수정" }
                        </button>
                &nbsp;&nbsp;
                <button type="button"
                        onClick={ () => { navigate(`/consultation/list`); } }>목록으로</button>
            </div>
        </div>
    );
}