import { FileTextIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import PageHeader from "@/common/components/PageHeader";
import Pagination from "@/common/components/Pagination";
import { RequestErrorAlert } from "@/common/components/RequestErrorAlert";
import { useRequest } from "@/common/hooks/useRequest";
import { getSafetyDocuments } from "@/safety/api/safetyDocumentApi";
import { SafetyDocumentTable } from "@/safety/components/SafetyDocumentTable";

const PAGE_SIZE = 10;

export default function SafetyDocumentListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const requestParams = { page, size: PAGE_SIZE };
  const { data, error, loading } = useRequest(getSafetyDocuments, requestParams);
  const documents = data?.content ?? [];
  const pageInfo = data?.page;

  const changePage = (nextPage) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", String(nextPage));
    setSearchParams(nextSearchParams);
  };

  return (
    <main className="flex w-full flex-col gap-6 px-8 py-6">
      <PageHeader
        title="안전문서"
        description="작업 안전문서와 벡터 인덱싱 상태를 확인합니다."
        icon={FileTextIcon}
      />

      <RequestErrorAlert
        error={error}
        fallbackDetail="안전문서 목록을 불러오지 못했습니다."
      />

      <SafetyDocumentTable
        documents={documents}
        loading={loading && !data}
        hasError={Boolean(error)}
      />

      {pageInfo?.totalPages > 0 && (
        <Pagination
          page={pageInfo.number + 1}
          totalPages={pageInfo.totalPages}
          onPageChange={(nextPage) => changePage(nextPage - 1)}
        />
      )}
    </main>
  );
}

function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 0 ? page : 0;
}
