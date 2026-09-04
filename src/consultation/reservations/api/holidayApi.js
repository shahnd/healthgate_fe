import { apiClient } from "@/common/api/apiClient";

export const getHolidaysInRange = async ({ rangeStart, rangeEnd, signal } = {}) => {

    const years = [...new Set([rangeStart.getFullYear(), rangeEnd.getFullYear()])];

    const responses = await Promise.all(

        years.map((year) => apiClient.get("/holidays", { params: { year }, signal }))
    );

    return responses.flatMap((res) => res.data);
};