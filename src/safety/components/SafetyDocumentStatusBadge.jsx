import { Badge } from "@/components/ui/badge";

const DOCUMENT_STATUS = {
  ACTIVE: { label: "활성", variant: "default" },
  INACTIVE: { label: "비활성", variant: "secondary" },
};

const INDEX_STATUS = {
  PENDING: { label: "대기", variant: "secondary" },
  INDEXING: { label: "처리 중", variant: "outline" },
  COMPLETED: { label: "완료", variant: "default" },
  FAILED: { label: "실패", variant: "destructive" },
  PURGING: { label: "삭제 중", variant: "outline" },
  PURGE_FAILED: { label: "삭제 실패", variant: "destructive" },
};

export function SafetyDocumentStatusBadge({ status }) {
  return <StatusBadge status={status} definitions={DOCUMENT_STATUS} />;
}

export function VectorIndexStatusBadge({ status }) {
  return (
    <StatusBadge
      status={status}
      definitions={INDEX_STATUS}
      emptyLabel="미인덱싱"
    />
  );
}

function StatusBadge({ status, definitions, emptyLabel = "알 수 없음" }) {
  const definition = definitions[status];
  if (!definition) {
    return <Badge variant="outline">{emptyLabel}</Badge>;
  }
  return <Badge variant={definition.variant}>{definition.label}</Badge>;
}
