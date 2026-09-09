import axios from "axios";

import { parseApiError } from "./parseApiError";

// 공통 API 클라이언트
export const apiClient = axios.create({
  baseURL: "/healthgate",
});

// RFC 9457 에러 파싱
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(parseApiError(error)),
);
