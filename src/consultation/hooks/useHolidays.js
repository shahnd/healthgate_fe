import { useMemo } from "react";
import { useRequest } from "@/common/hooks/useRequest";
import { getHolidaysInRange } from "../reservations/api/holidayApi";

export function useHolidays() {

    // 구간 시작
    const rangeStart = useMemo(() => {

        const d = new Date();
        d.setMonth(d.getMonth() - 1);

        return d;
    }, []);

    // 구간 종료
    const rangeEnd = useMemo(() => {

        const d = new Date();
        d.setMonth(d.getMonth() + 5);

        return d;
    }, []);

    const params = useMemo(() => ({ rangeStart, rangeEnd }), [rangeStart, rangeEnd]);

    // 요청
    const { data, error, loading } = useRequest(getHolidaysInRange, params);

    // YYYY-MM-DD
    const holidayStr = useMemo(() => (data ?? []).map((item) => {

        const s = item.locdate;

        return `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`;
    }), [data]);

    // 공휴일 목록
    const holidayEvents = useMemo(() => (data ?? []).map((item) => {

        const s = item.locdate;
        const dateObj = new Date(Number(s.substring(0, 4)), Number(s.substring(4, 6)) - 1, Number(s.substring(6, 8)));

        return { title: item.dateName, start: dateObj, end: dateObj, allDay: true, status: "HOLIDAY" };
    }), [data]);

    return { holidayStr, holidayEvents, loading, error };
}