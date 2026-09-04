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

export const getSafetyDocumentFileUrl = (id, { download = false } = {}) => {
  const query = download ? "?download=true" : "";
  return `${apiClient.defaults.baseURL}/safety-documents/${id}/file${query}`;
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

export const updateSafetyDocumentActivation = async ({ id, active, signal }) => {
  const response = await apiClient.patch(
    `/safety-documents/${id}/activation`,
    { active },
    { signal },
  );
  return response.data;
};

export const deleteSafetyDocument = async ({ id, signal }) => {
  await apiClient.delete(`/safety-documents/${id}`, { signal });
};
