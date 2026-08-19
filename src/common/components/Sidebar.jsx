import { useUserInfo, useAuthStore } from "../../store/useAuthStore";

export default function Sidebar() {
  const user = useUserInfo();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logout();
    alert("로그아웃 되었습니다.");
  };

  return (
    <aside className="sticky top-0 h-screen w-52 shrink-0 self-start overflow-y-auto bg-slate-800 p-5 text-white">
      <h2 className="mb-4 text-xl font-bold">메뉴</h2>

      <hr className="mb-4 border-slate-600" />

      <nav className="flex flex-col gap-2">
        <a
          href="/dashboard"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          대시보드
        </a>

        <a
          href="#profile"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          출근자 건강 정보조회
        </a>

        <div>
          <div className="block rounded px-3 py-2">보건 상담</div>

          <ul className="ml-4 flex flex-col gap-1 text-sm">
            <li>
              <a
                href="/consultation/reservation/list"
                className="block rounded px-3 py-2 transition hover:bg-slate-700"
              >
                상담 예약 조회
              </a>
            </li>

            <li>
              <a
                href="/consultation/reservation"
                className="block rounded px-3 py-2 transition hover:bg-slate-700"
              >
                상담 예약 신청
              </a>
            </li>

            <li>
              <a
                href="/consultation/list"
                className="block rounded px-3 py-2 transition hover:bg-slate-700"
              >
                상담 내역 조회
              </a>
            </li>
          </ul>
        </div>

        <a
          href="/checkup/list"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          건강검진
        </a>

        <a
          href="/hospital/list"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          병원 관리
        </a>

        <a
          href="/notice/list"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          공지사항
        </a>

        <a
          href="/employees"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          직원 관리
        </a>

        <a
          href="#settings"
          className="block rounded px-3 py-2 transition hover:bg-slate-700"
        >
          시스템
        </a>
      </nav>

      <div className="mt-10">
        {user ? (
          <>
            <p className="mb-2">{user.name}님 반갑습니다.</p>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-slate-700 px-3 py-2 hover:bg-slate-600"
            >
              로그아웃
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="block rounded px-3 py-2 hover:bg-slate-700"
          >
            로그인
          </a>
        )}
      </div>
    </aside>
  );
}