import { FileTextIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { TableContainer } from "@/common/components/TableContainer";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SafetyDocumentStatusBadge,
  VectorIndexStatusBadge,
} from "@/safety/components/SafetyDocumentStatusBadge";
import {
  formatDateTime,
  formatFileSize,
} from "@/safety/utils/formatSafetyDocument";

export function SafetyDocumentTable({ documents, loading, hasError }) {
  return (
    <TableContainer>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[28%]">제목</TableHead>
            <TableHead className="w-[24%]">파일명</TableHead>
            <TableHead>크기</TableHead>
            <TableHead>문서 상태</TableHead>
            <TableHead>인덱싱</TableHead>
            <TableHead>최종 수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : (
            documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell
                  className="max-w-0 truncate font-medium"
                  title={document.title}
                >
                  <Link
                    to={`/safety-documents/${document.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {document.title}
                  </Link>
                </TableCell>
                <TableCell
                  className="max-w-0 truncate"
                  title={document.originalFilename}
                >
                  {document.originalFilename}
                </TableCell>
                <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                <TableCell>
                  <SafetyDocumentStatusBadge status={document.status} />
                </TableCell>
                <TableCell>
                  <VectorIndexStatusBadge status={document.indexStatus} />
                </TableCell>
                <TableCell>{formatDateTime(document.updatedAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!loading && !hasError && documents.length === 0 && <EmptyDocuments />}
    </TableContainer>
  );
}

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <TableRow key={index} aria-hidden="true">
      {Array.from({ length: 6 }, (_, cellIndex) => (
        <TableCell key={cellIndex}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function EmptyDocuments() {
  return (
    <Empty className="min-h-64 border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>등록된 안전문서가 없습니다.</EmptyTitle>
        <EmptyDescription>
          안전문서가 등록되면 이곳에서 확인할 수 있습니다.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
