import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function NoticeCardComponent({ notices = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>공지사항</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {notices.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            등록된 공지사항이 없습니다
          </p>
        )}
        {notices.map((notice) => (
          <Link
            key={notice.id}
            href={`/notices/${notice.id}`}
            className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
          >
            <span className="text-sm truncate">{notice.title}</span>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">
              {notice.createdAt}
            </span>
          </Link>
        ))}
      </CardContent>
      <CardFooter>
        <Link
          to="/notices/list"
          className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
        >
          전체보기 <ChevronRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}