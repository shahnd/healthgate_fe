import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/employee.css"


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
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label>사번</label>
                <input type="text" name="employeeNumber" value={data.employeeNumber} onChange={handleChange} required/>
                <label>이름</label>
                <input type="text" name="name" value={data.name} onChange={handleChange} required/>
                <label>이메일</label>
                <input type="email" name="email" value={data.email} onChange={handleChange}/>
                <label>입사일</label>
                <input type="date" name="hireDate" value={data.hireDate} onChange={handleChange} required/>
                <label>전화번호</label>
                <input type="tel" name="phone" value={data.phone} onChange={handleChange}/>
                <label>권한</label>
                <select name="role" value={data.role} onChange={handleChange} required>
                    <option value="">권한을 선택하세요</option>
                    <option value="EMPLOYEE">직원</option>
                    <option value="HR_ADMIN">인사 관리자</option>
                    <option value="HEALTH_ADMIN">보건 관리자</option>
                </select>
                <label>부서코드</label>
                <select name="departmentId" value={data.departmentId || data.departments?.id || ""} onChange={handleChange} required>
                    <option value="">부서를 선택하세요</option>
                    {dlist.map(d => (
                        <option value={d.id}>{d.name}</option>
                    ))}
                </select>
                <label>직급코드</label>
                <select name="positionId" value={data.positionId || data.positions?.id || ""} onChange={handleChange} required>
                    <option value="">직급을 선택하세요</option>
                    {plist.map(p => (
                        <option value={p.id}>{p.name}</option>
                    ))}
                </select>

                <button type="submit">등록</button>
            </form>
        </div>
    );
}