import { parseLegacyJwtError } from "./error-adapters/legacyJwtErrorAdapter";
import { parseProblemDetail } from "./error-adapters/problemDetailAdapter";
import { parseTransportError } from "./error-adapters/transportErrorAdapter";
import { ProtocolError } from "./errors/ProtocolError";

const responseErrorAdapters = [parseProblemDetail, parseLegacyJwtError];

export function parseApiError(error) {
  const transportError = parseTransportError(error);

  if (transportError) {
    return transportError;
  }

  for (const adapter of responseErrorAdapters) {
    const parsedError = adapter(error);

    if (parsedError) {
      return parsedError;
    }
  }

  return new ProtocolError("서버가 RFC 9457 계약을 따르지 않았습니다.", error);
}
