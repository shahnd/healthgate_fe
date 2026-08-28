import { TransportError } from "../errors/TransportError";

export function parseTransportError(error) {
  if (error.response) {
    return null;
  }

  if (error.code === "ERR_CANCELED") {
    return new TransportError("CANCELED", "요청이 취소되었습니다.", error);
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new TransportError("TIMEOUT", "요청 시간이 초과되었습니다.", error);
  }

  return new TransportError(
    "NETWORK_ERROR",
    "서버에 연결하지 못했습니다.",
    error,
  );
}
