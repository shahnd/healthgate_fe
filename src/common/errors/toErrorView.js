import { AuthenticationError } from "@/common/api/errors/AuthenticationError";
import { ProblemError } from "@/common/api/errors/ProblemError";
import { ProtocolError } from "@/common/api/errors/ProtocolError";
import { TransportError } from "@/common/api/errors/TransportError";

const errorViewRegistry = [
  {
    matches: (error) => error instanceof ProblemError,
    map: (error) => ({
      title: error.title,
      detail: error.detail,
      code: error.code,
    }),
  },
  {
    matches: (error) => error instanceof AuthenticationError,
    map: (error) => ({
      title: "인증 실패",
      detail: error.message,
      code: error.code,
    }),
  },
  {
    matches: (error) => error instanceof TransportError,
    map: (error) => ({
      title: "서버 연결 실패",
      detail: error.message,
      code: error.code,
    }),
  },
  {
    matches: (error) => error instanceof ProtocolError,
    map: (error) => ({
      title: "API 오류 응답 형식 불일치",
      detail: error.message,
      code: "PROTOCOL_ERROR",
    }),
  },
];

export function toErrorView(error, fallback = {}) {
  if (!error) {
    return null;
  }

  const entry = errorViewRegistry.find(({ matches }) => matches(error));

  return entry
    ? entry.map(error)
    : {
        title: fallback.title ?? "알 수 없는 오류",
        detail: fallback.detail ?? "요청을 처리하지 못했습니다.",
        code: "UNKNOWN_ERROR",
      };
}
