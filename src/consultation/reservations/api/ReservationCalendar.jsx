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
      <button type="button" onClick={goToBack} style={{ padding: '5px 10px', cursor: 'pointer' }}>
        &lt;
      </button>

      <span style={{ fontWeight: 'bold', fontSize: '20px', minWidth: '100px', textAlign: 'center' }}>
        {koreanLabel}
      </span>

      <button type="button" onClick={goToNext} style={{ padding: '5px 10px', cursor: 'pointer' }}>
        &gt;
      </button>

      {/* <button onClick={goToToday}>오늘</button> */}
    </div>
  );
};


function ReservationCalendar({ onSelectSlot, selectedDate, currentDate, onNavigate }) {
  
  // 오늘 날짜를 담을 변수
  const today = new Date();
  today.setHours(0, 0, 0, 0) // 시간 0으로 맞추기

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // 3개월 이내만 예약 가능하게
  // 3개월 뒤 말일 계산 (오늘 기준 + 3개월)
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 4);
  maxDate.setHours(0, 0, 0, 0)

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
    if ((selectedSlotDate <= today)|| (selectedSlotDate > maxDate)) {
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
          weekdayFormat : (date, culture, localizer) => {
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
          if (targetDate <= today || targetDate > maxDate) {

            return { style : { 
                backgroundColor: '#f1f1f1',
                color: '#bcbcbc',
                cursor: 'not-allowed'
            }}
          }

          // 선택한 날짜 스타일 지정
          if(selectedDate && date.toDateString() === selectedDate.toDateString()) {
            return { style : { backgroundColor : "#FFAAAA" } }
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