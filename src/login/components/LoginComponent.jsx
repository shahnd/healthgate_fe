import axios from "axios";
import { useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

export default function LoginComponent() {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(formRef.current);
        const loginData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post(
                "/healthgate/auth/login",
                loginData,
                {
                    withCredentials: true,
                }
            );

            if (!response.data.accessToken) {
                alert("로그인 실패");
                return;
            }

            localStorage.setItem(
                "access_token",
                response.data.accessToken
            );

            const userInfo = {
                id: response.data.id,
                number: response.data.employeeNumber,
                name: response.data.name,
                role: response.data.role,
            };

            login(userInfo);

            alert(`${userInfo.name}님 반갑습니다.`);

            if (userInfo.role === "EMPLOYEE") {
                navigate("/bioinput");
            } else {
                navigate("/dashboard");
            }
        } catch {
            console.log("로그인 통신 실패");
        }
    };

    return (
        <div className="flex flex-col gap-7 justify-center items-center min-h-screen w-full pb-40">
            <img
                src="/logo_big.png"
                alt="logo_big"
                className="size-50! object-contain"
            />
            <LoginForm
                formRef={formRef}
                onSubmit={handleLogin}
                className="w-full max-w-sm"
                title="로그인"
                description="HealthGate 계정으로 로그인하세요."
            />
        </div>
    );
}