import { useUserInfo } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = ({allowedRoles}) => {

    const user = useUserInfo();

    //로컬 스토리지에 토큰 여부 확인
    const isAuthenticated = !!localStorage.getItem("access_token") && !!user;

    if (!isAuthenticated) {
        alert("로그인이 필요한 서비스입니다.");
        return <Navigate to="login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        alert("이 페이지에 접근 권한이 없습니다.");
        return <Navigate to={user.role === 'EMPLOYEE' ? '/bioinput' : '/dashboard'} replace />
    }

    return <Outlet/>

};

export default PrivateRoute;