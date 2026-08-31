import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import ko from 'date-fns/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const locales = { 'ko': ko }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ko }),
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


function ListCalendar({ dataList, onSelectEvent}) {

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
          weekdayFormat : (date, culture, localizer) => {
            const days = ["일", "월", "화", "수", "목", "금", "토"];
            return days[date.getDay()];
          }
        }}
        components={{ toolbar: CustomToolbar, }}
        onSelectEvent={onSelectEvent}  // prop 된 이벤트 클릭 핸들러
        selectable  // 슬롯 선택 가능하게
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