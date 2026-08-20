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

    useEffect(() => {
        // console.log(id);
        // 상세 정보 조회
        const selectReservation = async () => {

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
    }, []);
    return(
        <div>
            <h2>상담 예약 상세 조회</h2>
            <table>
                <tbody>
                    <tr>
                        <th width="130">신청자</th>
                        <td>{ reservation.employee.name }</td>
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
                        <td>{ reservation.scheduledTurn }</td>
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