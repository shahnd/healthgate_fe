import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/calendar.css';

const locales = { 'ko': ko }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: ko }),
  getDay,
  locales,
})

// 커스텀 툴바
const CustomToolbar = (toolbar) => {
  // '이전' 버튼 클릭 핸들러
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };
  // '다음' 버튼 클릭 핸들러
  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const koreanLabel = format(toolbar.date, 'M월', { locale: ko });

  // 레이아웃
  return (
    <div className="flex items-center justify-center gap-4 p-1 mb-2">
      <Button
        variant="outline" 
        size="sm" 
        onClick={goToBack}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">이전</span>
      </Button>

      <span className="min-w-[100px] text-center font-semibold text-sm sm:text-base">
        {koreanLabel}
      </span>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={goToNext}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">다음</span>
      </Button>

      {/* <Button variant="ghost" size="sm" onClick={goToToday}>오늘</Button> */}
    </div>
  );
};


function ListCalendar({ dataList, onSelectEvent }) {

  return (
    <div className="w-full max-w-[1000px] h-[800px] p-6 bg-background text-foreground">
      
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