import { apiClient } from "@/common/api/apiClient";

export const getSafetyDocuments = async ({ page = 0, size = 10, signal } = {}) => {
  const response = await apiClient.get("/safety-documents", {
    params: { page, size },
    signal,
  });

  return response.data;
};

export const getSafetyDocument = async ({ id, signal }) => {
  const response = await apiClient.get(`/safety-documents/${id}`, { signal });
  return response.data;
};

export const createSafetyDocument = async ({ formData, signal }) => {
  const response = await apiClient.post("/safety-documents", formData, { signal });
  return response.data;
};

export const updateSafetyDocument = async ({ id, title, description, signal }) => {
  const response = await apiClient.patch(
    `/safety-documents/${id}`,
    { title, description },
    { signal },
  );
  return response.data;
};

export const requestSafetyDocumentIndexing = async ({ id, signal }) => {
  const response = await apiClient.post(
    `/safety-documents/${id}/index`,
    null,
    { signal },
  );
  return response.data;
};
