import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeDetailComponent() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [ data, setData] = useState({});

    useEffect(() => {

        const getEmployee = async () => {

            try {
                const respone = await axios.get(`http://localhost:8006/healthgate/employees/${id}`);
                setData(respone.data.data);

                console.log(respone.data.data);

            } catch(error) {
                console.log("직원정보 상세 조회 통신 실패");
            }

        }

        getEmployee();

    }, []);

    const handleDelete = async () => {

        try {
            const response = await axios.delete(`http://localhost:8006/healthgate/employees/${id}`);

            alert("삭제 성공");
        } catch(error) {
            console.log("직원정보 삭제 통신 실패");
        }
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>사번</th>
                        <td>{data.employeeNumber}</td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td>{data.name}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{data.phone}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{data.email}</td>
                    </tr>
                    <tr>
                        <th>부서</th>
                        <td>{data.departments?.name}</td>
                    </tr>
                    <tr>
                        <th>직급</th>
                        <td>{data.positions?.name}</td>
                    </tr>
                    <tr>
                        <th>입사일</th>
                        <td>{data.hireDate}</td>
                    </tr>
                    <tr>
                        <th>재직 상태</th>
                        <td>{data.status}</td>
                    </tr>
                </tbody>
            </table>

            <button onClick={() => { navigate(`/employees/${id}/edit`)}}>편집</button>
            <button onClick={handleDelete}>삭제</button>
        </div>
    );
}