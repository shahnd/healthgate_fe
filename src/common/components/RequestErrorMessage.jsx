import { TriangleAlertIcon } from "lucide-react";

import { toErrorView } from "@/common/errors/toErrorView";

export function RequestErrorMessage({ error, fallbackDetail }) {
  const errorView = toErrorView(error, { detail: fallbackDetail });

  if (!errorView) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-2 text-sm text-destructive"
    >
      <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
      <p className="leading-5">{errorView.detail}</p>
    </div>
  );
}
