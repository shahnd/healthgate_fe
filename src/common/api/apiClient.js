import axios from "axios";

import { parseApiError } from "./parseApiError";

// 공통 API 클라이언트
export const apiClient = axios.create({
  baseURL: "/healthgate",
});

// JWT 토큰 주입
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RFC 9457 에러 파싱
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(parseApiError(error)),
);
