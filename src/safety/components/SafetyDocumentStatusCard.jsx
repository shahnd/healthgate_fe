import { useState } from "react";

import { RequestErrorMessage } from "@/common/components/RequestErrorMessage";
import { useMutation } from "@/common/hooks/useMutation";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  requestSafetyDocumentIndexing,
  updateSafetyDocumentActivation,
} from "@/safety/api/safetyDocumentApi";
import {
  SafetyDocumentStatusBadge,
  VectorIndexStatusBadge,
} from "@/safety/components/SafetyDocumentStatusBadge";

export function SafetyDocumentStatusCard({ document, canEdit, setDocument }) {
  return (
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
        <IndexingAction
          document={document}
          canEdit={canEdit}
          setDocument={setDocument}
        />
        <ActivationAction
          document={document}
          canEdit={canEdit}
          setDocument={setDocument}
        />
      </CardContent>
    </Card>
  );
}

function IndexingAction({ document, canEdit, setDocument }) {
  const {
    error,
    loading: requestingIndexing,
    mutate: requestIndexing,
  } = useMutation(requestSafetyDocumentIndexing);
  const canRequestIndexing =
    document.indexStatus == null || document.indexStatus === "FAILED";

  if (!canEdit || !canRequestIndexing) {
    return null;
  }

  const indexDocument = async () => {
    try {
      const updatedDocument = await requestIndexing({ id: document.id });
      setDocument(updatedDocument);
    } catch {
      // 오류는 useMutation이 보관하고 인덱싱 버튼 가까이에 표시합니다.
    }
  };

  return (
    <div className="space-y-3">
      <RequestErrorMessage
        error={error}
        fallbackDetail="안전문서 인덱싱을 요청하지 못했습니다."
      />
      <Button
        type="button"
        className="w-full"
        onClick={indexDocument}
        disabled={requestingIndexing || document.status !== "ACTIVE"}
      >
        {getIndexingButtonLabel(document.indexStatus, requestingIndexing)}
      </Button>
    </div>
  );
}

function ActivationAction({ document, canEdit, setDocument }) {
  const [deactivationDialogOpen, setDeactivationDialogOpen] = useState(false);
  const {
    error,
    loading: updatingActivation,
    mutate: updateActivation,
  } = useMutation(updateSafetyDocumentActivation);

  if (!canEdit) {
    return null;
  }

  const changeActivation = async (active) => {
    try {
      const updatedDocument = await updateActivation({
        id: document.id,
        active,
      });
      setDocument(updatedDocument);
      return true;
    } catch {
      // 오류는 useMutation이 보관하고 활성 상태 버튼 가까이에 표시합니다.
      return false;
    }
  };

  const deactivateDocument = async () => {
    const changed = await changeActivation(false);
    if (changed) {
      setDeactivationDialogOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <RequestErrorMessage
          error={error}
          fallbackDetail="안전문서의 활성 상태를 변경하지 못했습니다."
        />
        {document.status === "ACTIVE" ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setDeactivationDialogOpen(true)}
            disabled={updatingActivation}
          >
            비활성화
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full"
            onClick={() => changeActivation(true)}
            disabled={updatingActivation}
          >
            {updatingActivation ? "변경 중..." : "활성화"}
          </Button>
        )}
      </div>

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
              onClick={deactivateDocument}
            >
              {updatingActivation ? "변경 중..." : "비활성화"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function getIndexingButtonLabel(indexStatus, requestingIndexing) {
  if (requestingIndexing) {
    return "요청 중...";
  }
  return indexStatus === "FAILED" ? "인덱싱 재시도" : "인덱싱 요청";
}

function DetailItem({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </div>
  );
}
