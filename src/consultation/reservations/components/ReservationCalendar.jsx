import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../styles/calendar.css';
import CustomToolbar from '@/consultation/reservations/common/CustomToolbar'



const locales = { 'ko': ko }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ko }),
  getDay,
  locales,
})

function ReservationCalendar({ onSelectSlot, selectedDate, currentDate, onNavigate, holidays = [] }) {
  
  // 오늘 날짜를 담을 변수
  const today = new Date();
  today.setHours(0, 0, 0, 0) // 시간 0으로 맞추기

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // 3개월 이내만 예약 가능하게
  // 3개월 뒤 말일 계산 (오늘 기준 + 3개월)
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);
  maxDate.setHours(0, 0, 0, 0)

  // 날짜 포맷팅
  const formatDate = (targetDate) => {
      // 날짜 객체에서 연월 추출 - 'YYYY-MM-DD'
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
  }

  
  // 주말 판별
  const isWeekend = date => {
  const day = date.getDay();
  return day === 0 || day === 6; // 일, 토
  }

  // 공휴일 판별
  const isHoliday = date => holidays.includes(formatDate(date));
  const isUnavailableDay = date => isWeekend(date) || isHoliday(date);

  // 이번달 이전으로 이동 불가
  const handleNavigate = newDate => {
    
    // 이전달 이동 불가
    if (newDate < thisMonthStart) {
      return;
    }

    // 3개월 초과월 이동 불가
    if (newDate > maxDate) {
      return;
    }

    onNavigate(newDate);
  }
  
  const handleSelectSlot = slotInfo => {

    const selectedSlotDate = new Date(slotInfo.start);
    selectedSlotDate.setHours(0, 0, 0, 0);

    // 예약 가능 기간 외 선택 불가
    if ((selectedSlotDate <= today) ||
        (selectedSlotDate > maxDate) ||
        (isUnavailableDay(selectedSlotDate))) {

      alert("예약 불가능한 날짜입니다.")
      return;
    }

    // 예약 가능 기간 정상 작동
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }

  }
  return (
    <div style={{ height : 300, width : 350, padding : "10px" }}>

      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        views={['month']}   // 보여줄 뷰
        defaultView="month"
        date={ currentDate }
        formats={{
          weekdayFormat : (date) => {
            const days = ["일", "월", "화", "수", "목", "금", "토"];
            return days[date.getDay()];
          }
        }}
        components={{ toolbar: CustomToolbar, }} // 커스텀 툴바
        onSelectEvent={(event) => alert(event.title)}  // 이벤트 클릭
        onSelectSlot={ handleSelectSlot }  // 빈 슬롯 클릭 시 이벤트 실행
        // 기본 리액트 날짜 클릭 이벤트 가로채기
        onDrillDown={(date) => {
          handleSelectSlot({
            start : date,
            end : date,
            slots : [date],
            action : "click"
          })
        }}
        onNavigate = { handleNavigate }
        selectable  // 슬롯 선택 가능하게
        style={{ height: '100%' }}
        dayPropGetter={(date) => {

          const targetDate = new Date(date);
          targetDate.setHours(0, 0, 0, 0);

          // 예약 가능 기간 외 스타일 지정
          if (targetDate <= today ||
              targetDate > maxDate ||
              isUnavailableDay(targetDate)) {

            return { 
              className : "day-unavailable",
              style : { 
                backgroundColor: '#f1f1f1',
                color: '#bcbcbc',
                cursor: 'not-allowed'
            }}
          }

          // 선택한 날짜 스타일 지정
          if(selectedDate && date.toDateString() === selectedDate.toDateString()) {
            return {
              className : "day-available",
              style : { backgroundColor : "#FFCCCC" }
            }
          }
        }}
        messages={{
            next: '다음',
            previous: '이전',
            today: '오늘',
            month: '월',
            week: '주',
            day: '일',
            agenda: '일정',
            date: '날짜',
            time: '시간',
            event: '행사',
            noEventsInRange: '일정이 없습니다.',
        }}
      />
    </div>
  )
}

export default ReservationCalendar;