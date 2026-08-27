import { useCallback, useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { AuthenticationError } from "@/common/api/errors/AuthenticationError";
import { ProblemError } from "@/common/api/errors/ProblemError";
import { ProtocolError } from "@/common/api/errors/ProtocolError";
import { TransportError } from "@/common/api/errors/TransportError";
import { getTodaySafetyBriefing } from "@/safety/api/safetyBriefingApi";

function toErrorView(error) {
  if (error instanceof ProblemError) {
    return {
      title: error.title,
      detail: error.detail,
      code: error.code,
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      title: "인증 실패",
      detail: error.message,
      code: error.code,
    };
  }

  if (error instanceof TransportError) {
    return {
      title: "서버 연결 실패",
      detail: error.message,
      code: error.code,
    };
  }

  if (error instanceof ProtocolError) {
    return {
      title: "API 오류 응답 형식 불일치",
      detail: error.message,
      code: "PROTOCOL_ERROR",
    };
  }

  return {
    title: "알 수 없는 오류",
    detail: "오늘의 안전 브리핑을 불러오지 못했습니다.",
    code: "UNKNOWN_ERROR",
  };
}

export default function TodaySafetyBriefingPage() {
  const [briefing, setBriefing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBriefing = useCallback(async (signal) => {
    try {
      const result = await getTodaySafetyBriefing({ signal });
      setBriefing(result);
    } catch (requestError) {
      if (
        requestError instanceof TransportError &&
        requestError.code === "CANCELED"
      ) {
        return;
      }

      setError(requestError);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // API 응답 이후에만 state를 변경하며, unmount 시 요청을 취소한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBriefing(controller.signal);

    return () => controller.abort();
  }, [fetchBriefing]);

  const reloadBriefing = () => {
    setLoading(true);
    setError(null);
    fetchBriefing();
  };

  const errorView = error ? toErrorView(error) : null;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="size-7 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            오늘의 안전 브리핑
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          역삼1동의 업무시간 기상예보를 바탕으로 생성된 작업 안전 안내입니다.
        </p>
      </header>

      {errorView && (
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>{errorView.title}</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{errorView.detail}</p>
            <Badge variant="outline">{errorView.code}</Badge>
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl">
        <CardHeader className="border-b">
          <CardTitle>역삼1동 안전 브리핑</CardTitle>
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
