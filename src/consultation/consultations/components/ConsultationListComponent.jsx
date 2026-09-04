import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react";
import { selectConsultationListApi } from "../api/consultationApi";
import { useAuthStore } from "../../../store/useAuthStore";

import { Input } from "@/components/ui/input";
import Pagination from "../../../common/components/Pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/common/components/PageHeader";
import { MessageCircle } from "lucide-react";
import "@/common/styles/ListComponent.css";

import { Button } from "@/components/ui/button";


export default function ConsultationListComponent() {

    // ============================ 객체 및 보조 함수
    let navigate = useNavigate();
    // 유저 정보
    const authStore = useAuthStore();
    const user = authStore?.user;
    const role = user?.role;
    const loginUserId = user?.id;

    // 오늘 날짜 객체
    const today = new Date();
    // 검색 기간 제한 (12개월)
    const MAX_RANGE_MONTHS = 12;

    // 날짜 변환 ('YYYY-MM')
    const toMonthStr = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${ year }-${ month }`
    }

    // 오늘 기준 ± n개월
    const addMonths = (date, n) => {
        const result = new Date(date);
        result.setDate(1);
        result.setMonth(result.getMonth() + n);
        return result;
    }

    // 기간 필터 객체 초기화 (이번달 ~ 미래 3개월)
    const [startMonth, setStartMonth] = useState(toMonthStr(addMonths(today, 0)));
    const [endMonth, setEndMonth] = useState(toMonthStr(addMonths(today, 3)));

    // 필터링용 객체 추가
    const [nameFilter, setNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortOption, setSortOption] = useState("date_desc");

    // 상담 목록 객체
    const [consultationList, setConsultationList] = useState([]);
    // 페이지네이션
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    // 차시 -> 시간 매핑
    const turnTimeMap = {
        "T1": "10:00 ~ 10:50",
        "T2": "11:00 ~ 11:50",
        "T3": "13:00 ~ 13:50",
        "T4": "14:00 ~ 14:50",
        "T5": "15:00 ~ 15:50",
        "T6": "16:00 ~ 16:50",
    };

    // TN -> N차 + turnTimeMap
    const formatScheduledTurn = turn => {
        if (!turn) return "-";
        const turnNumber = turn.replace("T", "");
        const timeRange = turnTimeMap[turn] || "";

        return timeRange ? `${turnNumber}차 ${timeRange}` : "-";
    }

    // 상태값 매핑
    const statusMap = {
        "RESERVED" : "미완료",
        "FINISHED" : "완료",
        "EXPIRED" : "취소"
    };

    // 상태별 색상 매핑
    const statusColorMap = {
        "RESERVED": "#919191", // 미완료/예약 (주황빛 등)
        "FINISHED": "#27ae60", // 완료 (초록빛)
        "EXPIRED": "#e74c3c",  // 취소 (붉은빛)
    };
    
    // 상태값 -> 한글 변환
    const formatStatus = (status) => {
        return statusMap[status] || status;
    }

    // 한글 변환 + 색상 적용
    const formatStatusWithColor = (status) => {
        return (
            <span style={{ color: statusColorMap[status] || "#000000", fontWeight: "bold" }}>
                { formatStatus(status) }
            </span>
        );
    };

    // 시작 끝 차이 계산
    const monthDiff = (startStr, endStr) => {
        const [startYear, startM] = startStr.split("-").map(Number);
        const [endYear, endM] = endStr.split("-").map(Number);

        return (endYear - startYear) * 12 + (endM - startM);
    }

    // 'YYYY-MM' 문자열에 N개월 더한 결과
    const addMonthsStr = (monthStr, n) => {
        const [year, month] = monthStr.split("-").map(Number);
        const date = new Date(year, month - 1 + n, 1);
        return toMonthStr(date);
    }

    // 라벨 매핑
    const statusLabelMap = {
        ALL : "전체보기",
        RESERVED : "미완료",
        FINISHED : "완료",
        EXPIRED : "취소"
    }

    const sortLabelMap = {
        date_desc : "최신순",
        date_asc : "과거순",
        name_asc : "이름 ▲",
        name_desc : "이름 ▼"
    }

    // ============================ 동작용 함수
    // 시작 날짜 핸들러
    const handleStartMonthChange = e => {
        const value = e.target.value;
        setStartMonth(value);

        if (value > endMonth) {
            // 시작이 종료보다 늦어지면 종료를 시작에 맞춤
            setEndMonth(value);
        } else if (monthDiff(value, endMonth) > MAX_RANGE_MONTHS) {
            // 검색 최대 기간 초과 시 종료월을 시작+12로 당기기
            setEndMonth(addMonthsStr(value, MAX_RANGE_MONTHS));
        }
    };

    // 종료 날짜 핸들러
    const handleEndMonthChange = e => {
        const value = e.target.value;
        setEndMonth(value);

        if (value < startMonth) {
            // 종료가 시작보다 앞서면 시작을 종료에 맞춤
            setStartMonth(value);
        } else if (monthDiff(startMonth, value) > MAX_RANGE_MONTHS) {
            // 검색 최대 기간 초과 시 시작월을 종료 -12로 당기기
            setStartMonth(addMonthsStr(value, -MAX_RANGE_MONTHS));
        }
    };

    // 상담 목록 조회
    const selectConsultationList = async () => {
        try {

            const response = await selectConsultationListApi({ startMonth, endMonth });

            let items = response.data; 

            // 권한 체크
            if (role !== "HEALTH_ADMIN") {

                // 상담사 아닐 경우 본인 것만 조회
                items = items.filter((item) => item.employee?.id === loginUserId);
            }

            setConsultationList(items);
        } catch (error) {
            console.log("상담 목록 조회 통신 실패" + error);
        }
    };

    // 페이지 최초 진입 - 상담 목록 조회
    useEffect(() => {
        // loginUserId가 존재할 때만 API를 호출하도록 방어 코드 추가
        if (loginUserId !== undefined && loginUserId !== null) {
            selectConsultationList();
        }
    }, [role, loginUserId, startMonth, endMonth]);

    // 검색 버튼 클릭 시 실행
    const searchConsultation = e => {
        e.preventDefault();
        setPage(1);
        selectConsultationList();
    }

    // 이번달 버튼 클릭 시 실행
    const handleThisMonth = () => {
        const thisMonth = toMonthStr(today);
        setStartMonth(thisMonth);
        setEndMonth(thisMonth);
        setPage(1);
    }

    // 이름, 상태, 정렬 실시간 반영
    const filteredList = useMemo(() => {
        let result = [...consultationList];

        // 이름 검색
        if(nameFilter.trim()) {
            result = result.filter((item) => {
                return (item.employee?.name?.includes(nameFilter.trim()))
            });
        }

        // 상태 검색
        if(statusFilter !== "ALL") {
            result = result.filter((item) => {
                return (item.status === statusFilter)
            });
        }

        // 정렬
        result.sort((a, b) => {
            switch(sortOption) {
                case "date_asc" :
                    return a.scheduledDate.localeCompare(b.scheduledDate)
                        || a.scheduledTurn.localeCompare(b.scheduledTurn);
                case "date_desc" :
                    return b.scheduledDate.localeCompare(a.scheduledDate)
                        || b.scheduledTurn.localeCompare(a.scheduledTurn);
                case "name_asc" :
                    return (a.employee?.name || "").localeCompare(b.employee?.name || "");
                case "name_desc" :
                    return (b.employee?.name || "").localeCompare(a.employee?.name || "");
                default :
                    return 0;
            }
        });

        return result;
    }, [consultationList, nameFilter, statusFilter, sortOption]);

    // 총 페이지수
    const totalPages = Math.max(1, Math.ceil(filteredList.length / size));

    // 현재 페이지 구간만 잘라내기
    const pagedList = useMemo(() => {
        const start = (page - 1) * size;
        return filteredList.slice(start, start + size);
    }, [filteredList, page, size])

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [totalPages]);

    return(
        <div className="list-page">
            <PageHeader title="상담 내역 조회" description="상담 내역을 조회합니다." icon={MessageCircle}/>

            {/* 필터링 */}
            <div className="list-toolbar">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Input type="month"
                            value={ startMonth }
                            max={ endMonth }
                            onChange={ handleStartMonthChange } />
                        <span>~</span>
                        <Input type="month"
                            value={ endMonth }
                            min={ startMonth }
                            onChange={ handleEndMonthChange } />
                        <Button type="button"
                                size="lg"
                                variant="outline"
                                onClick={ handleThisMonth }>이번달</Button>
                        <Button type="submit"
                                size="lg"
                                variant="outline"
                                onClick={ searchConsultation }>검색</Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Input type="text"
                            placeholder="직원명을 입력하세요."
                            value={ nameFilter }
                            onChange={ e => {setNameFilter( e.target.value ); setPage(1); } } />

                        <Select name="status"
                                value={ statusFilter }
                                onValueChange={ val => { setStatusFilter(val); setPage(1); } }>
                            <SelectTrigger className="w-[140px]" size="sm">
                                <SelectValue placeholder="전체 보기">
                                    { statusLabelMap[statusFilter] }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ALL">전체보기</SelectItem>
                                    <SelectItem value="RESERVED">미완료</SelectItem>
                                    <SelectItem value="FINISHED">완료</SelectItem>
                                    <SelectItem value="EXPIRED">취소</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select name="sort"
                                value={ sortOption }
                                onValueChange={ val => { setSortOption(val); setPage(1); } }>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="정렬 선택">
                                    { sortLabelMap[sortOption] }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="date_desc">최신순</SelectItem>
                                    <SelectItem value="date_asc">과거순</SelectItem>
                                    <SelectItem value="name_asc">이름 ▲</SelectItem>
                                    <SelectItem value="name_desc">이름 ▼</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 목록 */}
            <div className="list-table-wrapper">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">예약번호</TableHead>
                            <TableHead className="w-[100px]">신청자</TableHead>
                            <TableHead className="w-[100px]">부서명</TableHead>
                            <TableHead className="w-[150px]">상담일</TableHead>
                            <TableHead className="w-[150px]">상담시간</TableHead>
                            <TableHead className="w-[100px]">상태</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { 
                            pagedList.length === 0 ? (
                                <TableRow className="cursor-pointer">
                                    <TableCell align="center" colSpan={ 6 } style={{ color : "#888888" }}>
                                        조회된 내용이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((item, index) => {
                                    return(
                                        <TableRow className="cursor-pointer" key={ index }
                                            onClick={() => { navigate(`/consultation/detail/${item.id}`); }}>
                                            <TableCell>{ item.id }</TableCell>
                                            <TableCell>{ item.employee?.name }</TableCell>
                                            <TableCell>{ item.employee?.departments?.name || "부서미지정" }</TableCell>
                                            <TableCell>{ item.scheduledDate }</TableCell>
                                            <TableCell>{ formatScheduledTurn(item.scheduledTurn) }</TableCell>
                                            <TableCell><b>{ formatStatusWithColor(item.status) }</b></TableCell>
                                        </TableRow>
                                    )
                                })
                            )
                        }
                    </TableBody>
                </Table>
            </div>

            <br /><br />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    )
}
