import { CalendarDaysIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestErrorAlert } from "@/common/components/RequestErrorAlert";
import { useRequest } from "@/common/hooks/useRequest";
import { getTodaySafetyBriefing } from "@/safety/api/safetyBriefingApi";
import PageHeader from "@/common/components/PageHeader";

export default function TodaySafetyBriefingPage() {
  const {
    data: briefing,
    error,
    loading,
    reload: reloadBriefing,
  } = useRequest(getTodaySafetyBriefing);

  return (
    <main className="flex flex-col gap-6 w-full pt-6 pb-8 px-8">
      <PageHeader
        title="오늘의 안전 브리핑"
        description="업무시간 기상예보를 바탕으로 생성된 작업 안전 안내입니다."
        icon={ShieldCheckIcon}
      />

      <RequestErrorAlert
        error={error}
        fallbackDetail="오늘의 안전 브리핑을 불러오지 못했습니다."
      />

      <Card className="max-w-4xl">
        <CardHeader className="border-b">
          <CardTitle>안전 브리핑(역삼 1동)</CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <CalendarDaysIcon className="size-4" />
            {briefing?.briefingDate ?? "오늘"}
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={reloadBriefing}
              disabled={loading}
            >
              <RefreshCwIcon className={loading ? "animate-spin" : undefined} />
              다시 불러오기
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3" aria-label="브리핑을 불러오는 중">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : briefing ? (
            <div className="whitespace-pre-wrap text-base leading-8">
              {briefing.content}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              표시할 안전 브리핑이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
