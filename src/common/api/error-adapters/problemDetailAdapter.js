import { z } from "zod";

import { ProblemError } from "../errors/ProblemError";

const problemDetailSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    instance: z.string(),
    code: z.string().optional(),
    errors: z.array(z.unknown()).optional(),
  })
  .passthrough();

export function parseProblemDetail(error) {
  const response = error.response;
  const contentType =
    response?.headers?.["content-type"] ??
    response?.headers?.get?.("content-type") ??
    "";

  if (!contentType.includes("application/problem+json")) {
    return null;
  }

  const result = problemDetailSchema.safeParse(response.data);

  if (!result.success || result.data.status !== response.status) {
    return null;
  }

  return new ProblemError(result.data, error);
}
