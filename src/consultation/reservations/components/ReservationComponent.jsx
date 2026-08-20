import { useEffect, useState } from "react";
import ReservationCalendar from "../api/ReservationCalendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function ReservationComponent() {

    const navigate = useNavigate();
    const [reservationData, setReservationData] = useState({
        consultationId : "",
        employee : {},
        manager : {},
        consultationScheduledDate : "",
        consultationScheduledTurn : "",
        consultationReason : ""
    });

    const [selectedDate, setSelectedDate] = useState();
    const [selectedTurn, setSelectedTurn] = useState("");
    const [reason, setReason] = useState("");
    
    // 예약된 차시 담을 배열
    const [scheduleList, setScheduleList] = useState([]);

    // 전체 차시 목록
    const turnList = [
        { id: "T1", label: "1차 10:00 ~ 10:50" },
        { id: "T2", label: "2차 11:00 ~ 11:50" },
        { id: "T3", label: "3차 13:00 ~ 13:50" },
        { id: "T4", label: "4차 14:00 ~ 14:50" },
        { id: "T5", label: "5차 15:00 ~ 15:50" },
    ];
    // 날짜 클릭 이벤트 핸들러
    const handleSelectSlot = async slotInfo => {
        // 선택
        setSelectedDate(slotInfo.start);

        // 날짜 포맷 변환
        const formattedDate = slotInfo.start.toISOString().split("T")[0];

        // 차시 조회
        try {
            // 날짜 선택 시 선택 가능한 차시 DB로부터 조회
            const response = await axios({
                url : "http://localhost:8006/reservations/views",
                method : "get",
                params : { consultationScheduledDate : formattedDate }
            })

            console.log(response.data.consultationScheduledTurn);

            setDisabled

            // 차시 목록 (선택불가 - disabled)
            const items = response.data.consultationScheduledTurn;
            const divArr = items.map((item, index) => {
                return(
                    <div key={index}>
                        <input type="radio"
                           name="consultationScheduledTurn"
                           id={item.consultationScheduledTurn}
                           onChange={handleTurnChange} /><label htmlFor={item.consultationScheduledTurn}>1차 10:00 ~ 10:50</label>
                        
                    </div>
                );
            })

            setScheduleList(divArr);
        } catch (error) {
            console.log("ajax 통신 실패" + error);
        }
    }

    // 차시 선택 이벤트 핸들러
    const handleTurnChange = e => {
        setSelectedTurn(e.target.id);
    }

    // 사유 입력 이벤트 핸들러
    const handleChange = e => {
        setReason(e.target.value);
    }

    // 상담 신청 버튼 클릭 시 실행할 이벤트
    const insertReservation = async e => {
        e.preventDefault();

        try {
            
            const response = await axios({
                url : `http://localhost:8006/reservations/reservations`,
                method : "post",
                data : reservationData
            });
            console.log(response.data);
        } catch (error) {
            console.log("ajax 통신 실패" + error);
        }

    }
    
    

    return(
        <div>
            <div>
                <button onClick={() => { navigate("/dashboard") }}>홈</button>&gt; 
                <button onClick={() => { navigate("/consultation/reservation/list") }}>보건상담</button> &gt; 
                상담예약
            </div>
            <h2>보건 상담 예약</h2>
            <table>
                <tbody>
                    <tr>
                        <th width="150">신청자</th>
                        <td width="300">{reservationData.employee.id}</td>
                        <th width="150">부서명</th>
                        <td width="300">{reservationData.employee.departmentId}</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>{reservationData.employee.phone}</td>
                        <th>직급</th>
                        <td>{reservationData.employee.positionId}</td>
                    </tr>
                </tbody>
            </table>
            <form className="reservation-form">
                <div className="reservation-date">
                    {/* 달력 - 날짜 선택 */}
                    <ReservationCalendar onSelectSlot={handleSelectSlot} />
                </div>
                <div className="reservation-turn">
                    {/* 차시 선택 */}
                    상담 시간
                    <br />
                    예약 가능한 시간을 선택할 수 있습니다.
                    <br />

                    {scheduleList}
                    <input type="radio"
                           name="consultationScheduledTurn"
                           id="T1"
                           onChange={handleTurnChange} /><label htmlFor="T1">1차 10:00 ~ 10:50</label>
                    <br />
                    <input type="radio"
                           name="consultationScheduledTurn"
                           id="T2"
                           onChange={handleTurnChange} /><label htmlFor="T2">2차 11:00 ~ 11:50</label>
                    <br />
                    <input type="radio"
                           name="consultationScheduledTurn"
                           id="T3"
                           onChange={handleTurnChange} /><label htmlFor="T3">3차 13:00 ~ 13:50</label>
                    <br />
                    <input type="radio"
                           name="consultationScheduledTurn"
                           id="T4"
                           onChange={handleTurnChange} /><label htmlFor="T4">4차 14:00 ~ 14:50</label>
                    <br />
                    <input type="radio"
                           name="consultationScheduledTurn"
                           id="T5"
                           onChange={handleTurnChange} /><label htmlFor="T5">5차 15:00 ~ 15:50</label>
                    <br />

                </div>

                <br /><br />

                <div>
                    신청 사유
                    <textarea name="consultationContent"
                              placeholder="신청 사유를 입력하세요."
                              value={reason}
                              onChange={handleChange}></textarea>
                </div>
            </form>
            <br />
            <div align="right">
                <button type="submit"
                        onClick={insertReservation}>상담 신청</button>
            </div>
        </div>
    )
}