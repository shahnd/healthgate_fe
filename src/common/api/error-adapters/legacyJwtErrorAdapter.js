import { AuthenticationError } from "../errors/AuthenticationError";

// 기존 JwtAuthInterceptor와의 임시 호환 계층
// 리팩터링 시 서버의 RFC 9457 응답으로 대체하고 이 어댑터를 제거한다.
const JWT_ERROR_CODES = new Map([
  ["인증 토큰이 누락되었습니다.", "AUTHENTICATION_REQUIRED"],
  ["유효하지 않거나 만료된 토큰입니다.", "INVALID_OR_EXPIRED_TOKEN"],
]);

export function parseLegacyJwtError(error) {
  if (error.response?.status !== 401) {
    return null;
  }

  const message = error.response.data?.message;
  const code = JWT_ERROR_CODES.get(message);

  if (!code) {
    return null;
  }

  return new AuthenticationError(code, message, error);
}
