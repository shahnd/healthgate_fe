import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import ko from 'date-fns/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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
  // '오늘' 버튼 클릭 핸들러

  // '이전' 버튼 클릭 핸들러
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };
  // '다음' 버튼 클릭 핸들러
  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const koreanLabel = format(toolbar.date, 'M', { locale: ko });

  // 레이아웃
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', // 중앙 정렬
      alignItems: 'center',
      marginBottom: '10px',
      padding: '5px',
      gap: '15px' // 버튼과 라벨 사이 간격
    }}>
      <button onClick={goToBack} style={{ padding: '5px 10px', cursor: 'pointer' }}>
        &lt;
      </button>

      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', minWidth: '100px', textAlign: 'center' }}>
        {koreanLabel}
      </span>

      <button onClick={goToNext} style={{ padding: '5px 10px', cursor: 'pointer' }}>
        &gt;
      </button>

      {/* <button onClick={goToToday}>오늘</button> */}
    </div>
  );
};


function ReservationCalendar() {

  return (
    <div style={{ height : 300, width : 400, padding : "10px" }}>
      
      <Calendar
        localizer={localizer}
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
        onSelectEvent={(event) => alert(event.title)}  // 이벤트 클릭
        onSelectSlot={(slotInfo) => console.log(slotInfo)}  // 빈 슬롯 클릭(날짜 선택)
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

export default ReservationCalendar;