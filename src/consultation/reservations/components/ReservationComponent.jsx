import { useEffect, useState } from "react";
import ReservationCalendar from "./ReservationCalendar";
import { useNavigate, useParams } from "react-router-dom";
import { saveReservationApi, selectDateApi, selectReservationApi } from "../api/reservationApi";
import "../styles/reservationCalendar.css";

export default function ReservationComponent() {

    // 네비게이트
    const navigate = useNavigate();

    // 수정모드 판별용 변수
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [originalDate, setOriginalDate] = useState("");
    const [originalTurn, setOriginalTurn] = useState("");
    // 신청자 데이터를 담을 변수 (로그인 연동)
    const [reservationData, setReservationData] = useState({
        id : "",
        employee : {
            // 신청자 하드코딩
            id : "4",
            name : "청운종"
        },
        scheduledDate : "",
        scheduledTurn : "",
        reason : "",
        status : "RESERVED",
        createdAt : ""
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    
    // 예약된 차시 담을 배열
    const [scheduleList, setScheduleList] = useState([]);

    // 전체 차시 목록
    const turnList = [
        { id: "T1", label: "1차 10:00 ~ 10:50" },
        { id: "T2", label: "2차 11:00 ~ 11:50" },
        { id: "T3", label: "3차 13:00 ~ 13:50" },
        { id: "T4", label: "4차 14:00 ~ 14:50" },
        { id: "T5", label: "5차 15:00 ~ 15:50" },
        { id: "T6", label: "6차 16:00 ~ 16:50" },
    ];

    // 날짜 포맷팅
    const formatDate = (targetDate) => {
            // 날짜 객체에서 연월 추출 - 'YYYY-MM-DD' 형식으로
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');

            // 백엔드에 전달할 형식으로 가공
            return `${year}-${month}-${day}`;
    }

    // 날짜 선택 이벤트 핸들러
    const handleSelectDate = async slotInfo => {

        // 선택 날짜 반영
        setSelectedDate(slotInfo.start);
        const formattedDate = formatDate(slotInfo.start);

        // 현재 클릭한날짜 와 기존 예약 날짜 비교
        const isReturningToOriginalDate = isEditMode && (formattedDate === originalDate);

        // 함수에도 반영
        setReservationData(prev => ({
            ...prev,
            scheduledDate : formattedDate,
            scheduledTurn : isReturningToOriginalDate ? prev.scheduledTurn : ""
        }));

        fetchSchedules(slotInfo.start, isReturningToOriginalDate ? originalTurn : "");
    }

    // 차시 선택 이벤트 핸들러
    const handleTurnChange = e => {
        // 날짜 선택 전
        if(!selectedDate && !reservationData.scheduledDate) {
            alert("상담 일자를 선택해주세요.");
            e.target.checked = false;
            return
        }

        // 날짜 선택 후
        setReservationData(prev => ({
            ...prev,
            scheduledTurn : e.target.id
        }));
    }

    // 사유 입력 이벤트 핸들러
    const handleChange = e => {
        setReservationData(prev => ({
            ...prev,
            reason : e.target.value
        }));
    }

    // 스케줄 조회용 함수
    const fetchSchedules = async (targetDate, targetTurn = "") => {

        try {
            // 선택 날짜 대입
            const dateStr = formatDate(targetDate);

            // 날짜 선택 시 선택 가능한 차시 DB로부터 조회
            const response = await selectDateApi(dateStr);

            // console.log(response.data);
            // console.log(response.data[0].scheduledTurn);

            // 차시 목록 (선택불가 - disabled)
            const items = response.data.map((item) => {return item.scheduledTurn });

            // console.log(items);
            // 선택한 날짜와 기존 예약 날짜 일치할 때
            const isSameDate = isEditMode && (dateStr === originalDate);

            const divArr = turnList.map((item, index) => {

                // 예약 된 차시인지  확인
                const isReserved = items.includes(item.id);

                // 기존 날짜, 예약된 차시
                const isOriginalTurn = isSameDate && (item.id === (targetTurn || reservationData.scheduledTurn));

                let statusText = "";
                if(isReserved) {
                    if(isOriginalTurn) {
                        statusText = "(현재 예약 시간)";
                    } else {
                        statusText = "(예약 완료)";
                    }
                }
                const isChecked = (item.id === reservationData.scheduledTurn);

                return(
                    <div key={index}>
                        <input type="radio"
                               name="scheduledTurn"
                               id={ item.id }
                               disabled={ isReserved && !isOriginalTurn }
                               checked={ isChecked }
                               onChange={ handleTurnChange } />
                        <label htmlFor={item.id} style={{ color: (isReserved && !isOriginalTurn) ? "#aaaaaa" : "#444444" }}>
                            { item.label } { statusText }
                        </label>
                    </div>
                );
            })

            setScheduleList(divArr);
        } catch (error) {
            console.log("ajax 통신 실패" + error);
        }
    }

    // 페이지 진입 시 실행할 구문 (내일 날짜 기준 초기화)
    useEffect(() => {

        const fetchDetailData = async () => {

        if(isEditMode) {
            try {
                // 수정모드: 기존 예약 정보 조회
                const response = await selectReservationApi(id);

                if(response.data) {
                    const data = response.data;
                    
                    // 1. 전체 예약 데이터
                    setReservationData(data);

                    // 2. 날짜 객체 생성
                    const targetDate = new Date(data.scheduledDate);
                    
                    // 3. 달력에 선택된 날짜와 현재 월 싱크 맞추기
                    setSelectedDate(targetDate);
                    setCurrentDate(targetDate);

                    // 4. 수정모드 - 기존 예약일 저장
                    setOriginalDate(data.scheduledDate);
                    setOriginalTurn(data.scheduledTurn);

                    // 5. 해당 날짜 스케줄, 기존 예약 차시 저장
                    fetchSchedules(targetDate, data.scheduledTurn);
                }
            } catch (error) {
                console.log("수정용 데이터 조회 실패" + error);
            }

            } else {

                // 신청모드
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() +1);

                const formattedToday = formatDate(tomorrow);
                setReservationData(prev => ({
                    ...prev,
                    scheduledDate : formattedToday,
                }));

                fetchSchedules(tomorrow);
            }
        }
        fetchDetailData();
    }, [id]);

    
    // scheduledTurn 이 바뀔 때 갱신
    useEffect(() => {
        const targetTurnToPass = isEditMode ? originalTurn : reservationData.scheduledTurn
        fetchSchedules(selectedDate, targetTurnToPass);
    }, [reservationData.scheduledTurn]);


    // 상담 신청 버튼 클릭 시 실행할 이벤트
    const saveReservation = async e => {
        e.preventDefault();

        // 유효성 검사
        if (!reservationData.scheduledTurn) {
            alert("상담 시간을 선택해주세요.");
            return;
        }

        if (!reservationData.reason.trim()) {
            alert("신청 사유를 입력해 주세요.");
            return;
        }

        // 컨펌창에 띄울 정보 셋팅
        const selectedTurnObj = turnList.find(item => item.id === reservationData.scheduledTurn);
        const turnLabel = selectedTurnObj ? selectedTurnObj.label : "";

        
        // 컨펌창 메시지 구성 및 띄우기
        const confirmMessage = `[상담 예약 확인]\n\n` +
                                `- 날짜 : ${reservationData.scheduledDate}\n` +
                                `- 시간 : ${turnLabel}\n` +
                                `- 사유 : ${reservationData.reason}\n\n` +
                                `위 내용으로 상담을 신청하시겠습니까?`;

        // 컨펌창 - 취소 시 함수 종료
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
   
            const response = await saveReservationApi(reservationData);
            // console.log(response.data);

            if(response.data != "") {
                alert("상담 신청이 예약되었습니다.")
            } else {
                alert("상담 신청 예약에 실패했습니다. 다시 시도해주세요.");
            }

            navigate("/consultation/reservation/list");

        } catch (error) {
            console.log("상담 신청 통신 실패" + error);
        }

    }

    // return 구문
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
                        <td width="300">{reservationData.employee.name}</td>
                        <th width="150">부서명</th>
                        <td width="300">{reservationData.employee?.department?.id}</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>{reservationData.employee?.phone || "-"}</td>
                        <th>직급</th>
                        <td>{reservationData.employee?.position?.id || "-"}</td>
                    </tr>
                </tbody>
            </table>
            <form className="reservation-form">
                <div className="reservation-date">
                    {/* 달력 - 날짜 선택 */}
                    <ReservationCalendar onSelectSlot={ handleSelectDate }
                                         selectedDate={ selectedDate }
                                         currentDate={ currentDate }
                                         onNavigate={ setCurrentDate } />
                </div>
                <div className="reservation-turn">
                    {/* 차시 선택 */}
                    상담 시간
                    <br />
                    예약 가능한 시간을 선택할 수 있습니다.
                    <br />
                    { scheduleList }
                </div>

                <br /><br />

                <div>
                    신청 사유
                    <textarea name="consultationContent"
                              placeholder="신청 사유를 입력하세요."
                              value={ reservationData.reason }
                              onChange={handleChange}></textarea>
                </div>
            </form>
            <br />
            <div align="right">
                <button type="submit"
                        onClick={saveReservation}>
                            {isEditMode ? "수정 완료" : "상담 신청"}
                        </button>
            </div>
        </div>
    )
}