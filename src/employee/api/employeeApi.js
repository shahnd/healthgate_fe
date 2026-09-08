import { apiClient } from "@/common/api/apiClient";

export const getEmployee = async ({ id, signal }) => {
  const response = await apiClient.get(`/employees/${id}`, { signal });
  return response.data.data;
};
