import { apiClient } from "@/common/api/apiClient";

export const getTodaySafetyBriefing = async ({ signal } = {}) => {
  const response = await apiClient.get("/safety-briefings/today", { signal });
  return response.data;
};
