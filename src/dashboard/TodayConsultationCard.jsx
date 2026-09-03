import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"

const STATUS_MAP = {
  RESERVED: { label: "예정", variant: "secondary" },
  FINISHED: { label: "완료", variant: "outline" },
  CANCELED: { label: "취소", variant: "destructive" },
}

export default function TodayConsultationCard({ consultations = [] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-muted-foreground"/>
          <CardTitle>금일 상담 일정</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {consultations.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            오늘 예정된 상담이 없습니다
          </p>
        )}
        {consultations.map((c) => {
          const status = STATUS_MAP[c.status] ?? STATUS_MAP.RESERVED
          return (
            <div key={c.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {c.employeeName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.employeeName}</p>
                <p className="text-xs text-muted-foreground">{c.time}</p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}