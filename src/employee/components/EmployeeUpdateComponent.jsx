import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EmployeeUpdateComponent() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [plist, setPlist] = useState([]);
    const [dlist, setDlist] = useState([]);

    useEffect(() => {
        
        const getData = async () => {

            try {
                const response = await axios.get(`http://localhost:8006/healthgate/employees/${id}`);
                const response2 = await axios.get('http://localhost:8006/healthgate/employees/init');

                setData(response.data.data);
                setDlist(response2.data.data.departmentList);
                setPlist(response2.data.data.positionList);
                

            } catch(error) {
                console.log("직원정보 조회 통신 실패");
            }
        }

        getData();

    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setData({...data, [name]: value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const { departmentId, positionId, departments, positions, createdAt, updatedAt, ...rest } = data;

            const sendData = {
                ...rest,
                departments: {
                    id: Number(departmentId || departments?.id)
                },
                positions: {
                    id: Number(positionId || positions.id)
                }
            }

            console.log(sendData);

            const response = await axios.put(`http://localhost:8006/healthgate/employees/${id}`, sendData);

            alert("수정 성공");
            navigate(`/employees/${id}`);

        } catch(error) {
            console.log("직원 수정 통신 실패");
        }
    }

    if (!data) {
        return (
            <div>
                데이터 로딩중
            </div>
        )
    }

    return (
        <div className="page">
            <h1 className="page-title">직원 정보 수정</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <th>사번</th>
                                <td>
                                    <input
                                        type="text"
                                        name="employeeNumber"
                                        value={data.employeeNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>이름</th>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>이메일</th>
                                <td>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>입사일</th>
                                <td>
                                    <input
                                        type="date"
                                        name="hireDate"
                                        value={data.hireDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>전화번호</th>
                                <td>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>권한</th>
                                <td>
                                    <select
                                        name="role"
                                        value={data.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">권한을 선택하세요</option>
                                        <option value="EMPLOYEE">직원</option>
                                        <option value="HR_ADMIN">인사 관리자</option>
                                        <option value="HEALTH_ADMIN">보건 관리자</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th>부서</th>
                                <td>
                                    <select
                                        name="departmentId"
                                        value={
                                            data.departmentId ||
                                            data.departments?.id ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">부서를 선택하세요</option>

                                        {dlist.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th>직급</th>
                                <td>
                                    <select
                                        name="positionId"
                                        value={
                                            data.positionId ||
                                            data.positions?.id ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">직급을 선택하세요</option>

                                        {plist.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="action-area">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(`/employees/${id}`)}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}