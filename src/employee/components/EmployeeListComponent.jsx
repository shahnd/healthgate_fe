import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/employee.css"

export default function EmployeeListComponent() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);



    useEffect(() => {

        const getEmployees = async () => {

            try {
                const response = await axios.get('http://localhost:8006/healthgate/employees', {
                    params: {
                        page: page,
                        size: size
                    }
                });

                setEmployees(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                console.log(response.data.data);
    
            } catch(error) {
                console.log("직원 조회 통신 실패");
            }

        }

        getEmployees();

    }, [page, size]);


    //페이지 계산
    const PAGE_LIMIT = 3;
    const startPage = Math.floor((page - 1) / PAGE_LIMIT) * PAGE_LIMIT + 1
    const endPage = Math.min(startPage + PAGE_LIMIT - 1, totalPages);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-7">
            <h1 className="text-4xl font-bold">직원 리스트</h1>

            <table>
                <thead>
                    <tr>
                        <th>사번</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>직급</th>
                        <th>이메일</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(e => (
                        <tr key={e.id} onClick={() => {navigate(`/employees/${e.id}`)}}>
                            <td>{e.employeeNumber}</td>
                            <td>{e.name}</td>
                            <td>{e.departments?.name || "부서 미지정"}</td>
                            <td>{e.positions?.name || "직급 미지정"}</td>
                            <td>{e.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button type="button" onClick={() => {navigate('/employees/new')}}>직원 등록</button>

            <div>
                {page > PAGE_LIMIT &&
                    <button onClick={() => setPage(startPage - 1)}
                    >이전 페이지</button>
                }

                
                {Array.from({length: endPage - startPage + 1}, (_, i) => (i + startPage)).map(pageNumber => (
                    (page !== pageNumber ?
                    <button key={pageNumber}
                            onClick={() => setPage(pageNumber)}>{pageNumber}</button> :
                    <button key={pageNumber} className="font-bold"
                            onClick={() => setPage(pageNumber)}>{pageNumber}</button>)
                ))}

                {page < totalPages &&
                    <button onClick={() => setPage(endPage + 1)}>다음 페이지</button>
                }


            </div>
        </div>
    );
}