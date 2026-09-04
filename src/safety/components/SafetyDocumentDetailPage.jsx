import { useEffect, useState } from "react";
import { ArrowLeftIcon, FileTextIcon, PencilIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/common/components/PageHeader";
import { RequestErrorAlert } from "@/common/components/RequestErrorAlert";
import { useMutation } from "@/common/hooks/useMutation";
import { useRequest } from "@/common/hooks/useRequest";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getEmployee } from "@/employee/api/employeeApi";
import {
  getSafetyDocument,
  requestSafetyDocumentIndexing,
  updateSafetyDocumentActivation,
  updateSafetyDocument,
} from "@/safety/api/safetyDocumentApi";
import {
  SafetyDocumentStatusBadge,
  VectorIndexStatusBadge,
} from "@/safety/components/SafetyDocumentStatusBadge";
import {
  formatDateTime,
  formatFileSize,
} from "@/safety/utils/formatSafetyDocument";
import { useUserInfo } from "@/store/useAuthStore";

const INDEX_POLL_INTERVAL = 2000;
const POLLING_INDEX_STATUSES = new Set(["PENDING", "INDEXING"]);

export default function SafetyDocumentDetailPage() {
  const { id } = useParams();
  const {
    data: document,
    error,
    loading,
    reload,
    setData,
  } = useRequest(getSafetyDocument, { id });
  const {
    error: indexingError,
    loading: requestingIndexing,
    mutate: requestIndexing,
  } = useMutation(requestSafetyDocumentIndexing);
  const {
    error: activationError,
    loading: updatingActivation,
    mutate: updateActivation,
  } = useMutation(updateSafetyDocumentActivation);

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

  const indexDocument = async () => {
    try {
      const updatedDocument = await requestIndexing({ id: document.id });
      setData(updatedDocument);
    } catch {
      // 오류는 useMutation이 보관하고 RequestErrorAlert가 표시합니다.
    }
  };

  const changeActivation = async (active) => {
    try {
      const updatedDocument = await updateActivation({
        id: document.id,
        active,
      });
      setData(updatedDocument);
      return true;
    } catch {
      // 오류는 useMutation이 보관하고 RequestErrorAlert가 표시합니다.
      return false;
    }
  };

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

      <RequestErrorAlert
        error={indexingError}
        fallbackTitle="안전문서 인덱싱 요청 실패"
        fallbackDetail="안전문서 인덱싱을 요청하지 못했습니다."
      />

      <RequestErrorAlert
        error={activationError}
        fallbackTitle="안전문서 상태 변경 실패"
        fallbackDetail="안전문서의 활성 상태를 변경하지 못했습니다."
      />

      {loading && !document ? (
        <DetailSkeleton />
      ) : (
        document && (
          <DocumentDetail
            document={document}
            setDocument={setData}
            onRequestIndexing={indexDocument}
            requestingIndexing={requestingIndexing}
            onChangeActivation={changeActivation}
            updatingActivation={updatingActivation}
          />
        )
      )}
    </main>
  );
}

function DocumentDetail({
  document,
  setDocument,
  onRequestIndexing,
  requestingIndexing,
  onChangeActivation,
  updatingActivation,
}) {
  const user = useUserInfo();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deactivationDialogOpen, setDeactivationDialogOpen] = useState(false);
  const {
    error: updateError,
    loading: updating,
    mutate,
    reset,
  } = useMutation(updateSafetyDocument);
  const canEdit = user?.role === "HEALTH_ADMIN";
  const canRequestIndexing =
    document.indexStatus == null || document.indexStatus === "FAILED";

  const startEditing = () => {
    setTitle(document.title);
    setDescription(document.description ?? "");
    reset();
    setEditing(true);
  };

  const cancelEditing = () => {
    reset();
    setEditing(false);
  };

  const save = async (event) => {
    event.preventDefault();

    try {
      const updatedDocument = await mutate({
        id: document.id,
        title,
        description,
      });
      setDocument(updatedDocument);
      setEditing(false);
    } catch {
      // 오류는 useMutation이 보관하고 RequestErrorAlert가 표시합니다.
    }
  };

  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{editing ? "문서 정보 수정" : document.title}</CardTitle>
          <CardDescription>문서 설명</CardDescription>
          {canEdit && !editing && (
            <CardAction>
              <Button type="button" variant="outline" onClick={startEditing}>
                <PencilIcon />
                수정
              </Button>
            </CardAction>
          )}
        </CardHeader>
        {editing ? (
          <CardContent>
            <RequestErrorAlert
              error={updateError}
              fallbackTitle="안전문서 수정 실패"
              fallbackDetail="문서 정보를 수정하지 못했습니다. 입력 내용을 확인해 주세요."
            />
            <form className="mt-5 space-y-5" onSubmit={save}>
              <div className="space-y-2">
                <Label htmlFor="document-title">제목</Label>
                <Input
                  id="document-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={200}
                  disabled={updating}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-description">설명</Label>
                <Textarea
                  id="document-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={2000}
                  className="min-h-28 resize-y"
                  disabled={updating}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={updating}
                >
                  취소
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
              {document.description || "등록된 설명이 없습니다."}
            </p>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>상태</CardTitle>
          <CardDescription>문서와 벡터 인덱스 상태입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailItem label="문서 상태">
            <SafetyDocumentStatusBadge status={document.status} />
          </DetailItem>
          <DetailItem label="인덱싱 상태">
            <VectorIndexStatusBadge status={document.indexStatus} />
          </DetailItem>
          {canEdit && canRequestIndexing && (
            <Button
              type="button"
              className="w-full"
              onClick={onRequestIndexing}
              disabled={
                requestingIndexing || document.status !== "ACTIVE"
              }
            >
              {requestingIndexing
                ? "요청 중..."
                : document.indexStatus === "FAILED"
                  ? "인덱싱 재시도"
                  : "인덱싱 요청"}
            </Button>
          )}
          {canEdit && document.status === "ACTIVE" && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setDeactivationDialogOpen(true)}
              disabled={updatingActivation}
            >
              비활성화
            </Button>
          )}
          {canEdit && document.status === "INACTIVE" && (
            <Button
              type="button"
              className="w-full"
              onClick={() => onChangeActivation(true)}
              disabled={updatingActivation}
            >
              {updatingActivation ? "변경 중..." : "활성화"}
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deactivationDialogOpen}
        onOpenChange={setDeactivationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>안전문서를 비활성화할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              비활성화하면 이후 안전 브리핑 생성에 이 문서가 사용되지
              않습니다. 기존 인덱스는 보존됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updatingActivation}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={updatingActivation}
              onClick={async () => {
                const changed = await onChangeActivation(false);
                if (changed) {
                  setDeactivationDialogOpen(false);
                }
              }}
            >
              {updatingActivation ? "변경 중..." : "비활성화"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>등록 정보</CardTitle>
          <CardDescription>저장된 파일과 변경 이력 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Metadata label="파일명" value={document.originalFilename} />
            <Metadata label="파일 형식" value={document.contentType} />
            <Metadata
              label="파일 크기"
              value={formatFileSize(document.fileSize)}
            />
            <CreatorMetadata employeeId={document.createdById} />
            <Metadata
              label="등록일"
              value={formatDateTime(document.createdAt)}
            />
            <Metadata
              label="최종 수정일"
              value={formatDateTime(document.updatedAt)}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function CreatorMetadata({ employeeId }) {
  const {
    data: employee,
    error,
    loading,
  } = useRequest(getEmployee, {
    id: employeeId,
  });

  let value = employee?.name ?? "-";
  if (loading) {
    value = "조회 중...";
  } else if (error) {
    value = "작성자 조회 실패";
  }

  return <Metadata label="작성자" value={value} />;
}

function DetailItem({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </div>
  );
}

function Metadata({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className="mt-1 truncate text-sm font-medium"
        title={String(value ?? "-")}
      >
        {value ?? "-"}
      </dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div
      className="grid w-full max-w-5xl gap-6 lg:grid-cols-3"
      aria-hidden="true"
    >
      <Skeleton className="h-48 lg:col-span-2" />
      <Skeleton className="h-48" />
      <Skeleton className="h-52 lg:col-span-3" />
    </div>
  );
}
