import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from '../../common/components/Pagination'

export default function AttendanceListComponent() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const getToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const [searchCondition, setSearchCondition] = useState({
        name: '',
        employeeNumber: '',
        departmentId: '',
        positionId: '',
        searchDate: getToday(),
        status: ''
    });

    const [submittedCondition, setSubmittedCondition] = useState(searchCondition);

    const [dlist, setDlist] = useState([]);
    const [plist, setPlist] = useState([]);


    useEffect(() => {
        const getEmployees = async () => {

            try {
                const response = await axios.get('http://localhost:8006/healthgate/employees', {
                    params: {
                        page: page,
                        size: size,
                        ...submittedCondition
                    }
                });
                const response2 = await axios.get('http://localhost:8006/healthgate/employees/init')
                setDlist(response2.data.data.departmentList);
                setPlist(response2.data.data.positionList);

                setEmployees(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                console.log(response.data.data);
    
            } catch(error) {
                console.log("직원 조회 통신 실패");
            }

        }


        getEmployees();
        const intervalId = setInterval(getEmployees, 5000);
        return () => clearInterval(intervalId);

    }, [page, size, submittedCondition]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setSearchCondition(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = e => {
        e.preventDefault();
        setPage(1);
        setSubmittedCondition(searchCondition);
    }
    return (
        <div className="page">
            <h1 className="page-title">직원 리스트</h1>

            {/* 검색 */}
            <div className="card">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="이름 검색"
                        value={searchCondition.name}
                        onChange={handleInputChange}
                    />

                    <input
                        type="text"
                        name="employeeNumber"
                        placeholder="사번 검색"
                        value={searchCondition.employeeNumber}
                        onChange={handleInputChange}
                    />

                    <select
                        name="positionId"
                        value={searchCondition.positionId}
                        onChange={handleInputChange}
                    >
                        <option value="">직급을 선택하세요</option>
                        {plist.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="departmentId"
                        value={searchCondition.departmentId}
                        onChange={handleInputChange}
                    >
                        <option value="">부서를 선택하세요</option>
                        {dlist.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <input type="date" name="searchDate" value={searchCondition.searchDate} onChange={handleInputChange}/>

                    <select
                        name="status"
                        value={searchCondition.status}
                        onChange={handleInputChange}>
                        <option value="">전체</option>
                        <option value="ATTENDANCE">출근</option>
                        <option value="DENY">출근거부</option>
                    </select>

                    <button className="btn-primary" type="submit">
                        검색
                    </button>
                </form>
            </div>

            {/* 직원 목록 */}
            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>사번</th>
                            <th>이름</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>이메일</th>
                            <th>출근시간</th>
                            <th>출근상태</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((e) => (
                            <tr
                                key={e.id}
                                onClick={() => navigate(`/employees/${e.id}`)}
                            >
                                <td>{e.employeeNumber}</td>
                                <td>{e.name}</td>
                                <td>{e.departmentName || "부서 미지정"}</td>
                                <td>{e.positionName || "직급 미지정"}</td>
                                <td>{e.email}</td>
                                <td>{e.clockInAt || "-"}</td>
                                <td>{e.attendanceStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage}/>

            </div>
        </div>
    )
}