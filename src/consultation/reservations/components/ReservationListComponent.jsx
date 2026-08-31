import { useNavigate } from "react-router-dom";
import ListCalendar from "./ListCalendar";
import { useEffect, useState } from "react";
import {selectAllReservationApi} from "../api/reservationApi";
import { useAuthStore } from "@/store/useAuthStore";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/DetailComponent.css";


export default function ReservationListComponent() {

  const navigate = useNavigate();
  // 조회 데이터 담을 변수
  const [dataList, setDataList] = useState([]);
  // 연월을 담을 변수
  const [currentDate, setCurrentDate] = useState(new Date());

  // 유저 정보
  const authStore = useAuthStore();
  const user = authStore?.user;
  const role = user?.role;
  const loginUserId = user?.id;
  
  // 연월이 바뀔 때마다 조회 후 목록 띄우기
  useEffect(() => {
    const selectAllReservation = async () => {
      try {

        // 날짜 객체에서 연월 추출 - 'YYYY-MM-DD' 형식으로
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        // 백엔드에 전달할 형식으로 가공
        const dateStr = `${year}-${month}-01`;
        
        // 전달
        const response = await selectAllReservationApi(dateStr);
        let items = response.data;

        // 권한 체크
        if(role !== "HEALTH_ADMIN") {
          items = items.filter((item) => item.employee?.id === loginUserId);
        }

        const formattedData = items.map((item, index) => {

          // 조회된 데이터 양식 지정 - T1 홍길동 -> 1차 홍길동
          const turnNumber = item.scheduledTurn ? item.scheduledTurn.replace("T", "") : "";
          const title = `${turnNumber}차 ${item.employee.name}`;
          const dateObj = new Date(item.scheduledDate);

          return {
            id : item.id,
            title : title,
            start : dateObj,
            end : dateObj,
            allDay : true,
          }
        })

        setDataList(formattedData);
      } catch (error) {
        console.log("리스트 호출 ajax 통신 실패" + error);
      }
    }

    selectAllReservation();
  }, [currentDate, role, loginUserId]);

  // 이전 다음 버튼 클릭 시 실행할 이벤트 핸들러
  const handleNavigate = newDate => {
    setCurrentDate(newDate);
  }

  // 조회된 요소 클릭 시 실행할 이벤트 핸들러
  const handleSelectEvent = e => {
    // 예약 내용 상세 조회로 이동
    navigate(`/consultation/reservation/detail/${e.id}`)
  };

  return (
    <div className="detail-page">
      <PageHeader title="보건 상담 예약 현황" description="보건 상담 예약 현황을 조회합니다." icon={MessageCircle}/>

      <ListCalendar dataList={ dataList }
                    onSelectEvent={ handleSelectEvent }
                    onNavigate={ handleNavigate } />
      <div align="right">
        <button onClick={ () => {navigate("/consultation/reservation")} }>예약 하러 가기 ⇒</button>
      </div>
    </div>
  );
}