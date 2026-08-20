import axios from "axios";
import { useEffect, useState } from "react";
import { useUserInfo } from "../../store/useAuthStore";

export default function MyPageComponent() {

    const user = useUserInfo();


    const [data, setData] = useState({});

    useEffect(() => {

        const getEmployee = async () => {

            
            try {
                const response = await axios.get(`http://localhost:8006/healthgate/employees/${user.id}`);
                setData(response.data.data);

            } catch(error) {
                console.log("마이페이지 통신 실패");
            }
        }

        getEmployee();


    }, [])

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

        </div>
    );
}