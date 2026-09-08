import { FilePlus2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "@/common/components/PageHeader";
import { RequestErrorAlert } from "@/common/components/RequestErrorAlert";
import { useMutation } from "@/common/hooks/useMutation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSafetyDocument } from "@/safety/api/safetyDocumentApi";

export default function SafetyDocumentCreatePage() {
  const navigate = useNavigate();
  const { error, loading, mutate } = useMutation(createSafetyDocument);

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await mutate({ formData });
    navigate("/safety-documents");
  };

  return (
    <main className="flex w-full flex-col gap-6 px-8 py-6">
      <PageHeader
        title="안전문서 등록"
        description="PDF 안전문서와 문서 정보를 등록합니다. 인덱싱은 등록 후 별도로 요청할 수 있습니다."
        icon={FilePlus2Icon}
      />

      <RequestErrorAlert
        error={error}
        fallbackTitle="안전문서 등록 실패"
        fallbackDetail="안전문서를 등록하지 못했습니다. 입력 내용과 파일을 확인해 주세요."
      />

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>문서 정보</CardTitle>
          <CardDescription>
            등록 직후에는 인덱싱되지 않은 상태로 저장됩니다.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                maxLength={200}
                placeholder="문서를 구분할 제목을 입력하세요."
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                name="description"
                maxLength={2000}
                placeholder="문서의 용도나 내용을 간단히 설명하세요."
                className="min-h-28 resize-y"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">PDF 파일</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf,.pdf"
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                최대 20MB의 PDF 파일을 선택할 수 있습니다.
              </p>
            </div>
          </CardContent>

          <CardFooter className="mt-6 justify-end gap-2">
            <Link
              to="/safety-documents"
              className={buttonVariants({ variant: "outline" })}
            >
              취소
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "등록 중..." : "등록"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
