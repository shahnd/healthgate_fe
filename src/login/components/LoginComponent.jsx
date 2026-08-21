import axios from "axios";
import { useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

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
                if (userInfo.role === "EMPLOYEE") {
                    navigate('/bioinput');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert("로그인 실패");
            }

        } catch(error) {
            console.log("로그인 통신 실패");
        }


    }


    return (
        <div className="page">
            <div className="login-card">

                <h1 className="login-title">
                    로그인
                </h1>

                <form
                    ref={formRef}
                    onSubmit={handleLogin}
                    className="login-form"
                >
                    <div className="login-field">
                        <label>아이디</label>
                        <input
                            type="text"
                            name="employeeNumber"
                            placeholder="아이디"
                        />
                    </div>

                    <div className="login-field">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        로그인
                    </button>
                </form>

            </div>
        </div>
    );
}