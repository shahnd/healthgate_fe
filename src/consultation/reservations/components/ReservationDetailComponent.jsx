import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectReservationApi } from "../api/consultationApi";


export default function ReservationDetailComponent() {

    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 출력 데이터 변수
    const [reservation, setReservation] = useState({
        employee : {
            id : "",
            name : ""
        },
        id : "",
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        status : ""
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

    useEffect(() => {
        // console.log(id);
        // 상세 정보 조회
        const selectReservation = async () => {

            if(!id) return;

            try {
                
                const response = await selectReservationApi(id);

                // console.log(response.data);
                if(response.data != "") {

                    setReservation(response.data);
                } else {

                    alert("예약이 없거나 취소되었습니다.");
                }
                
                // console.log(reservation);
            } catch (error) {
                console.log("예약 상세 조회 통신 실패" + error);
            }
        }

        selectReservation();
    }, [id]);
    return(
        <div>
            <h2>상담 예약 상세 조회</h2>
            <table>
                <tbody>
                    <tr>
                        <th width="130">신청자</th>
                        <td>{ reservation.employee?.name }</td>
                    </tr>
                    <tr>
                        <th>부서명</th>
                        <td>{ reservation.employee?.department?.name || "-" }</td>
                    </tr>
                    <tr>
                        <th>직급</th>
                        <td>{ reservation.employee?.position?.name || "-" }</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>{ reservation.employee?.phone || "-" }</td>
                    </tr>
                    <tr>
                        <th>상담일</th>
                        <td>{ reservation.scheduledDate }</td>
                    </tr>
                    <tr>
                        <th>시간</th>
                        <td>{ formatScheduledTurn(reservation.scheduledTurn) }</td>
                    </tr>
                    <tr>
                        <th>신청사유</th>
                        <td>{ reservation.reason }</td>
                    </tr>
                </tbody>
            </table>
            <div align="center">
                <button onClick={() => { navigate("/consultation/reservation"); }}>예약 수정</button>
                &nbsp;&nbsp;
                <button onClick={() => { navigate(""); }}>예약 취소</button>
            </div>
        </div>
    );
};