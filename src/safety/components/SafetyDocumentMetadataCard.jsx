import { DownloadIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { RequestErrorMessage } from "@/common/components/RequestErrorMessage";
import { useMutation } from "@/common/hooks/useMutation";
import { useRequest } from "@/common/hooks/useRequest";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployee } from "@/employee/api/employeeApi";
import {
  deleteSafetyDocument,
  getSafetyDocumentFileUrl,
} from "@/safety/api/safetyDocumentApi";
import {
  formatDateTime,
  formatFileSize,
} from "@/safety/utils/formatSafetyDocument";

export function SafetyDocumentMetadataCard({ document, canEdit }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    error: deleteError,
    loading: deleting,
    mutate: deleteDocument,
  } = useMutation(deleteSafetyDocument);
  const fileUrl = getSafetyDocumentFileUrl(document.id);
  const downloadUrl = getSafetyDocumentFileUrl(document.id, { download: true });

  const confirmDelete = async () => {
    try {
      await deleteDocument({ id: document.id });
      navigate("/safety-documents");
    } catch {
      // 오류는 useMutation이 보관하고 등록 정보 카드 안에 표시합니다.
    }
  };

  return (
    <>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>등록 정보</CardTitle>
          <CardDescription>저장된 파일과 변경 이력 정보입니다.</CardDescription>
          <CardAction className="flex gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ExternalLinkIcon />
              파일 열기
            </a>
            <a
              href={downloadUrl}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <DownloadIcon />
              다운로드
            </a>
            {canEdit && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2Icon />
                삭제
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-5">
          <RequestErrorMessage
            error={deleteError}
            fallbackDetail="안전문서를 삭제하지 못했습니다."
          />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>안전문서를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              문서 정보와 저장된 파일이 삭제됩니다. 기존 벡터 인덱스는
              재사용을 위해 보존됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CreatorMetadata({ employeeId }) {
  const {
    data: employee,
    error,
    loading,
  } = useRequest(getEmployee, { id: employeeId });

  let value = employee?.name ?? "-";
  if (loading) {
    value = "조회 중...";
  } else if (error) {
    value = "작성자 조회 실패";
  }

  return <Metadata label="작성자" value={value} />;
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
