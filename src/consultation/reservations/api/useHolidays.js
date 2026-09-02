import { useEffect, useState } from "react";

// 공휴일 호출용 훅
export function useHolidays() {

    const [holidayEvents, setHolidayEvents] = useState([]); // 목록 달력용
    const [holidayStr, setHolidayStr] = useState([]); // 예약 달력용

    useEffect(() => {

        const fetchHolidays = async () => {

            try {

                const today = new Date();

                const rangeStart = new Date(today);
                rangeStart.setMonth(rangeStart.getMonth() - 1);

                const rangeEnd = new Date(today);
                rangeEnd.setMonth(rangeEnd.getMonth() + 4);

                const years = [...new Set([rangeStart.getFullYear(), rangeEnd.getFullYear()])];

                const response = await Promise.all(
                    years.map( year =>
                        fetch(`http://localhost:8006/consultation/holidays?solYear=${year}`)
                            .then(res => res.json())
                    )
                );

                const allItems = response.flat();
                const holidayItems = allItems.filter(item => item.isHoliday === "Y");

                const strList = holidayItems.map(item => {
                    const str = item.locdate;
                    return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
                });

                setHolidayStr(strList);
            } catch (error) {
                console.log("공휴일 조회 통신 실패", error);
            }
        }

        fetchHolidays();
    }, []);

    return { holidayStr, holidayEvents };
}