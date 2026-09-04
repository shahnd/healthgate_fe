import { useRequest } from "@/common/hooks/useRequest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployee } from "@/employee/api/employeeApi";
import {
  formatDateTime,
  formatFileSize,
} from "@/safety/utils/formatSafetyDocument";

export function SafetyDocumentMetadataCard({ document }) {
  return (
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
          <Metadata label="등록일" value={formatDateTime(document.createdAt)} />
          <Metadata
            label="최종 수정일"
            value={formatDateTime(document.updatedAt)}
          />
        </dl>
      </CardContent>
    </Card>
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
