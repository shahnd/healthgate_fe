import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react";
import { selectConsultationListApi } from "../api/consultationApi";

export default function ConsultationListComponent() {

    // ============================ 객체 및 보조 함수
    let navigate = useNavigate();

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

    // 상태값 -> 한글 변환
    const formatStatus = (status) => {
        return statusMap[status] || status;
    }

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

            const response = await selectConsultationListApi();
            setConsultationList(response.data);
        } catch (error) {
            console.log("상담 목록 조회 통신 실패" + error);
        }
    };

    // 페이지 최초 진입 - 상담 목록 조회
    useEffect(() => {
        selectConsultationList();
    }, []);

    // 검색 버튼 클릭 시 실행
    const searchConsultation = e => {
        e.preventDefault();
        selectConsultationList();
    }

    // 이번달 버튼 클릭 시 실행
    const handleThisMonth = () => {
        const thisMonth = toMonthStr(today);
        setStartMonth(thisMonth);
        setEndMonth(thisMonth);
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
                    return a.scheduledDate.localeCompare(b.scheduledDate);
                case "date_desc" :
                    return b.scheduledDate.localeCompare(a.scheduledDate);
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

    return(
        <div>
            <h2>상담 내역 조회</h2>

            <br /><br />

            {/* 필터링 */}
            <table>
                <tbody>
                    <tr>
                        <th>기간</th>
                        <td width="200" colSpan={ 2 }>
                            <form>
                                <input type="month"
                                    value={ startMonth }
                                    max={ endMonth }
                                    onChange={ handleStartMonthChange } /> - 
                                <input type="month"
                                    value={ endMonth }
                                    min={ startMonth }
                                    onChange={ handleEndMonthChange } />
                                <button type="button"
                                        onClick={ handleThisMonth }>이번달</button>
                                &nbsp;&nbsp;
                                <button type="submit"
                                        onClick={ searchConsultation }>검색</button>
                            </form>
                        </td>
                        <td colSpan={ 3 }></td>
                    </tr>
                    <tr>
                        <th width="130">이름</th>
                        <td width="200">
                            <input type="text"
                                placeholder="직원명을 입력하세요."
                                value={ nameFilter }
                                onChange={ e => setNameFilter( e.target.value ) } />
                        </td>
                        <th width="130">상태</th>
                        <td width="200">
                            <select name="status"
                                    value={ statusFilter }
                                    onChange={ e => setStatusFilter( e.target.value ) }>
                                <option value="ALL">전체보기</option>
                                <option value="RESERVED">미완료</option>
                                <option value="FINISHED">완료</option>
                                <option value="EXPIRED">취소</option>
                            </select>
                        </td>
                        <th width="130">정렬</th>
                        <td width="200">
                            <select name="sort"
                                    value={ sortOption }
                                    onChange={ e => setSortOption( e.target.value ) }>
                                <option value="date_desc">최신순</option>
                                <option value="date_asc">과거순</option>
                                <option value="name_asc">이름 ▲</option>
                                <option value="name_desc">이름 ▼</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br /><br />

            {/* 목록 */}
            <table>
                <thead>
                    <tr>
                        <th width="100">예약번호</th>
                        <th width="100">신청자</th>
                        <th width="100">부서명</th>
                        <th width="150">상담일</th>
                        <th width="150">상담시간</th>
                        <th width="100">상태</th>
                    </tr>
                </thead>
                <tbody align="center">
                    { filteredList.map((item, index) => {
                        return(
                            <tr key={ index }
                                onClick={() => { navigate(`/consultation/detail/${item.id}`); }}>
                                <td>{ item.id }</td>
                                <td>{ item.employee?.name }</td>
                                <td>{ item.employee?.departments?.name }</td>
                                <td>{ item.scheduledDate }</td>
                                <td>{ formatScheduledTurn(item.scheduledTurn) }</td>
                                <td><b>{ formatStatus(item.status) }</b></td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>

            <br /><br />
            {/* 페이징바 - shadcn 사용 예정 */}
        </div>
    )
}