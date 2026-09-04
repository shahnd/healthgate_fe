import { format} from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'


// 커스텀 툴바
export default function CustomToolbar(toolbar) {
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
    </div>
  );
};