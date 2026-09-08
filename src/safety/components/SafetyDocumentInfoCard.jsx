import { useState } from "react";
import { PencilIcon } from "lucide-react";

import { RequestErrorMessage } from "@/common/components/RequestErrorMessage";
import { useMutation } from "@/common/hooks/useMutation";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { updateSafetyDocument } from "@/safety/api/safetyDocumentApi";

export function SafetyDocumentInfoCard({ document, canEdit, setDocument }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {
    error,
    loading,
    mutate,
    reset,
  } = useMutation(updateSafetyDocument);

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
      // 오류는 useMutation이 보관하고 입력 폼 안에 표시합니다.
    }
  };

  return (
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
          <form className="space-y-5" onSubmit={save}>
            <RequestErrorMessage
              error={error}
              fallbackDetail="문서 정보를 수정하지 못했습니다. 입력 내용을 확인해 주세요."
            />
            <div className="space-y-2">
              <Label htmlFor="document-title">제목</Label>
              <Input
                id="document-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEditing}
                disabled={loading}
              >
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "저장 중..." : "저장"}
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
  );
}
