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
  startOfWeek: (date) => startOfWeek(date, { locale: ko }),
  getDay,
  locales,
})


function ListCalendar({ dataList, onSelectEvent }) {

  return (
    <div className="w-full max-w-[1000px] h-[800px] p-6 text-foreground">
      
      <Calendar
        localizer={localizer}
        events={dataList} // prop 된 DB 조회 데이터
        startAccessor="start"
        endAccessor="end"
        views={['month']}   // 보여줄 뷰
        defaultView="month"
        formats={{
          weekdayFormat : (date) => {
            const days = ["일", "월", "화", "수", "목", "금", "토"];
            return days[date.getDay()];
          }
        }}
        components={{ toolbar: CustomToolbar, }}
        onSelectEvent={onSelectEvent}  // prop 된 이벤트 클릭 핸들러
        selectable  // 슬롯 선택 가능하게
        eventPropGetter={event => {
          let backgroundColor = "cornflowerblue";
          let color = "white";
          let border = "none";

          if(event.status === "FINISHED") backgroundColor = "#27ae60"; // 상담완료
          if(event.status === "EXPIRED") backgroundColor = "#e74c3c"; // 상담 취소

          // 공휴일
          if (event.status === "HOLIDAY") {
              backgroundColor = "transparent";
              border = "none";
              color = "#e74c3c";
          }

          return {
            style : {
              backgroundColor,
              borderRadius : "4px",
              border,
              color,
              fontWeight : event.status === "HOLIDAY" ? "bold" : "normal"
            }
          }
        }} // 이벤트별 색상
        style={{ height: '100%' }}
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

export default ListCalendar;