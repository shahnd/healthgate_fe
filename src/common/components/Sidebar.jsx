import { useUserInfo } from "../../store/useAuthStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function Sidebar() {

  const user = useUserInfo();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logout();
    alert("로그아웃 되었습니다.");
  }

    return (
    <div className="w-52 h-screen bg-slate-800 text-white p-5">
      <h2 className="text-xl font-bold mb-4">메뉴</h2>
      <hr className="border-slate-600 mb-4" />
      <nav className="flex flex-col gap-2">
        <a href="/dashboard" className="block py-2 px-3 hover:bg-slate-700 rounded transition">대시보드</a>
        <a href="#profile" className="block py-2 px-3 hover:bg-slate-700 rounded transition">출근자 건강 정보조회</a>
        <a className="block py-2 px-3 hover:bg-slate-700 rounded transition">보건 상담</a>
        <ul>
          <li><a href="/consultation/reservation/list">상담 예약 조회</a></li>
          <li><a href="/consultation/reservation">상담 예약 신청</a></li>
          <li><a href="/consultation/list">상담 내역 조회</a></li>
        </ul>
        <a href="#settings" className="block py-2 px-3 hover:bg-slate-700 rounded transition">건강검진</a>
        <a href="/hospital/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">병원 관리</a>
        <a href="/notice/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">공지사항</a>
        <a href="/employee/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">직원 관리</a>
        <a href="#settings" className="block py-2 px-3 hover:bg-slate-700 rounded transition">시스템</a>
      </nav>

      <div className="mt-100">
        {user ? 
          `${user.name}님 반갑습니다.` 
          :
          <a href="/login">로그인</a>
        }

        {user ?
        <button onClick={handleLogout}>로그아웃</button> :
        ""
        }


      </div>
    </div>
    );
}