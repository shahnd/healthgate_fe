import { describe, expect, it } from "vitest";

import { AuthenticationError } from "./errors/AuthenticationError";
import { ProblemError } from "./errors/ProblemError";
import { ProtocolError } from "./errors/ProtocolError";
import { TransportError } from "./errors/TransportError";
import { parseApiError } from "./parseApiError";

describe("parseApiError", () => {
  it("parses an RFC 9457 response", () => {
    // given
    const error = {
      response: {
        status: 503,
        headers: { "content-type": "application/problem+json" },
        data: {
          type: "/problems/safety-briefing-generation-failed",
          title: "안전 브리핑 생성 실패",
          status: 503,
          detail: "오늘의 안전 브리핑을 생성하지 못했습니다.",
          instance: "/healthgate/safety-briefings/today",
          code: "SAFETY_BRIEFING_GENERATION_FAILED",
        },
      },
    };

    // when
    const result = parseApiError(error);

    // then
    expect(result).toBeInstanceOf(ProblemError);
    expect(result.code).toBe("SAFETY_BRIEFING_GENERATION_FAILED");
  });

  it("parses the known JWT authentication response", () => {
    // given
    const error = {
      response: {
        status: 401,
        data: { message: "인증 토큰이 누락되었습니다." },
      },
    };

    // when
    const result = parseApiError(error);

    // then
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("rejects an unsupported HTTP error contract", () => {
    // given
    const error = {
      response: {
        status: 500,
        headers: { "content-type": "application/json" },
        data: { message: "오류가 발생했습니다." },
      },
    };

    // when
    const result = parseApiError(error);

    // then
    expect(result).toBeInstanceOf(ProtocolError);
  });

  it("parses an error without an HTTP response as a transport error", () => {
    // given
    const error = { code: "ERR_NETWORK" };

    // when
    const result = parseApiError(error);

    // then
    expect(result).toBeInstanceOf(TransportError);
    expect(result.code).toBe("NETWORK_ERROR");
  });
});
