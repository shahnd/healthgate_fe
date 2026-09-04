import { apiClient } from "@/common/api/apiClient";

export const getSafetyDocuments = async ({ page = 0, size = 10, signal } = {}) => {
  const response = await apiClient.get("/safety-documents", {
    params: { page, size },
    signal,
  });

  return response.data;
};
