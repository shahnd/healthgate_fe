import { useState } from "react";

export default function EmployeeCreateComponent() {

    const [employee, setEmployees] = useState({
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

    return(
        <div>


            <form className="flex flex-col">
                <label>사번</label>
                <input type="text" name="employeeNumber"/>
                <label>이름</label>
                <input type="text" name="name"/>
                <label>비밀번호</label>
                <input type="password" name="password"/>
                <label>비밀번호 재확인</label>
                <input type="password"/>
                <label>이메일</label>
                <input type="email"/>
                <label>입사일</label>
                <input type="hireDate"/>
                <label>전화번호</label>
                <input type="phone"/>
                <label>권한</label>
                <input type="role"/>
                <label>부서코드</label>
                <input type="departmentId"/>
                <label>직급코드</label>
                <input type="positionId"/>

                <button type="submit">등록</button>
            </form>
        </div>
    );
}