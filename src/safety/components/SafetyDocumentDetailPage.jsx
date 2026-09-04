import { useEffect } from "react";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/common/components/PageHeader";
import { RequestErrorAlert } from "@/common/components/RequestErrorAlert";
import { useRequest } from "@/common/hooks/useRequest";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSafetyDocument } from "@/safety/api/safetyDocumentApi";
import { SafetyDocumentInfoCard } from "@/safety/components/SafetyDocumentInfoCard";
import { SafetyDocumentMetadataCard } from "@/safety/components/SafetyDocumentMetadataCard";
import { SafetyDocumentStatusCard } from "@/safety/components/SafetyDocumentStatusCard";
import { useUserInfo } from "@/store/useAuthStore";

const INDEX_POLL_INTERVAL = 2000;
const POLLING_INDEX_STATUSES = new Set(["PENDING", "INDEXING"]);

export default function SafetyDocumentDetailPage() {
  const { id } = useParams();
  const user = useUserInfo();
  const {
    data: document,
    error,
    loading,
    reload,
    setData,
  } = useRequest(getSafetyDocument, { id });
  const canEdit = user?.role === "HEALTH_ADMIN";

  useEffect(() => {
    if (
      loading ||
      error ||
      !POLLING_INDEX_STATUSES.has(document?.indexStatus)
    ) {
      return undefined;
    }

    const timeoutId = window.setTimeout(reload, INDEX_POLL_INTERVAL);
    return () => window.clearTimeout(timeoutId);
  }, [document?.indexStatus, error, loading, reload]);

  return (
    <main className="flex w-full flex-col gap-6 px-8 py-6">
      <PageHeader
        title="안전문서 상세"
        description="안전문서의 등록 정보와 현재 상태를 확인합니다."
        icon={FileTextIcon}
      >
        <Link
          to="/safety-documents"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeftIcon />
          목록으로
        </Link>
      </PageHeader>

      <RequestErrorAlert
        error={error}
        fallbackTitle="안전문서 조회 실패"
        fallbackDetail="안전문서 정보를 불러오지 못했습니다."
      />

      {loading && !document ? (
        <DetailSkeleton />
      ) : (
        document && (
          <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-3">
            <SafetyDocumentInfoCard
              document={document}
              canEdit={canEdit}
              setDocument={setData}
            />
            <SafetyDocumentStatusCard
              document={document}
              canEdit={canEdit}
              setDocument={setData}
            />
            <SafetyDocumentMetadataCard document={document} />
          </div>
        )
      )}
    </main>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-3">
      <Skeleton className="h-72 lg:col-span-2" />
      <Skeleton className="h-72" />
      <Skeleton className="h-48 lg:col-span-3" />
    </div>
  );
}
