import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function EmployeeCreateComponent() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeNumber: "",
        password: "",
        name: "",
        hireDate: "",
        email: "",
        phone: "",
        role: "",
        departmentId: "",
        positionId: ""

    });

    const [dlist, setDlist] = useState([]);
    const [plist, setPlist] = useState([]);

    useEffect(() => {

        const getInitInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8006/healthgate/employees/init')

                setDlist(response.data.data.departmentList);
                setPlist(response.data.data.positionList);
                
            } catch(error) {
                console.log("초기 정보 통신 조회 실패");
            }
        }

        getInitInfo();

    }, [])

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if (confirmPassword !== formData.password) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const {departmentId, positionId, ...rest} = formData;

        const sendData = {
            ...rest,
            departments: {
                id: Number(departmentId)
            },
            positions: {
                id: Number(positionId)
            }
        }

        try {
            const response = await axios.post('http://localhost:8006/healthgate/employees', sendData);

            alert("직원 등록에 성공했습니다.")
            navigate('/employees')

        } catch(error) {
            console.log("등록 통신 실패");
        }
    }

    return(
        <div className="page">
            <h1 className="page-title">직원 등록</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <th>*사번</th>
                                <td>
                                    <input
                                        type="text"
                                        name="employeeNumber"
                                        value={formData.employeeNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>*이름</th>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>*비밀번호</th>
                                <td>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>*비밀번호 확인</th>
                                <td>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>*입사일</th>
                                <td>
                                    <input
                                        type="date"
                                        name="hireDate"
                                        value={formData.hireDate}
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
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th>*권한</th>
                                <td>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">권한을 선택하세요</option>
                                        <option value="EMPLOYEE">직원</option>
                                        <option value="HR_ADMIN">인사 관리자</option>
                                        <option value="HEALTH_ADMIN">보건 관리자</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th>*부서</th>
                                <td>
                                    <select
                                        name="departmentId"
                                        value={formData.departmentId}
                                        onChange={handleChange}
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
                                <th>*직급</th>
                                <td>
                                    <select
                                        name="positionId"
                                        value={formData.positionId}
                                        onChange={handleChange}
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
                        <button className="btn-secondary" type="button">
                            취소
                        </button>

                        <button className="btn-primary" type="submit">
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}