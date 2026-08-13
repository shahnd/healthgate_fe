import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeListComponent() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    useEffect(() => {

        const getEmployees = async () => {

            try {
                const response = await axios.get('http://localhost:8006/healthgate/employees');

                setEmployees(response.data);
    
            } catch(error) {
                console.log("직원 조회 통신 실패");
            }

        }

        getEmployees();

    }, []);



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
                        <tr key={e.id}>
                            <td>{e.employeeNumber}</td>
                            <td>{e.name}</td>
                            <td>{e.departments.name}</td>
                            <td>{e.positions.name}</td>
                            <td>{e.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button type="button" onClick={() => {navigate('/employees/new')}}>직원 등록</button>
        </div>
    );
}