import axios from "axios";
import { useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
    const navigate = useNavigate();

    const formRef = useRef(null);

    const login = useAuthStore(state => state.login);

    const handleLogin = async (e) => {

        e.preventDefault();

        const formData = new FormData(formRef.current);
        const loginData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post('http://localhost:8006/healthgate/auth/login', loginData,
                {
                    withCredentials: true
                }
            );

            if(response.data.accessToken) {

                //로컬 스토리지에 저장
                localStorage.setItem("access_token", response.data.accessToken);

                const userInfo = {
                    "id": response.data.id,
                    "number": response.data.employeeNumber,
                    "name": response.data.name,
                    "role": response.data.role
                }

                login(userInfo);



                alert(`${userInfo.name}님 반갑습니다`);
                navigate('/dashboard');
            } else {
                alert("로그인 실패");
            }

        } catch(error) {
            console.log("로그인 통신 실패");
        }


    }


    return (
        <div className="flex justify-center items-center min-h-screen ml-80">

            <form ref={formRef} onSubmit={handleLogin}>

                <div className="space-y-2">
                    <div>
                        <label className="block font-semibold">아이디</label>
                        <input type="text" name="employeeNumber" placeholder="아이디"
                        className="border p-1"/>
                    </div>

                    <div>
                        <label className="block font-semibold">비밀번호</label>
                        <input type="password" name="password" placeholder="비밀번호"
                        className="border p-1"/>
                    </div>

                </div>

                <button type="submit" className="w-full bg-blue-50">로그인</button>
            </form>

        </div>
    );
}