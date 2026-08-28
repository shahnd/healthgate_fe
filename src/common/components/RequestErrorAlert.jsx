import { TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toErrorView } from "@/common/errors/toErrorView";

export function RequestErrorAlert({ error, fallbackTitle, fallbackDetail }) {
  const errorView = toErrorView(error, {
    title: fallbackTitle,
    detail: fallbackDetail,
  });

  if (!errorView) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{errorView.title}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{errorView.detail}</p>
        <Badge variant="outline">{errorView.code}</Badge>
      </AlertDescription>
    </Alert>
  );
}
