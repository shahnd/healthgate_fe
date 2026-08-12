export default function Sidebar() {
    return (
    <div className="w-52 h-screen bg-slate-800 text-white p-5">
      <h2 className="text-xl font-bold mb-4">메뉴</h2>
      <hr className="border-slate-600 mb-4" />
      <nav className="flex flex-col gap-2">
        <a href="#home" className="block py-2 px-3 hover:bg-slate-700 rounded transition">대시보드</a>
        <a href="#profile" className="block py-2 px-3 hover:bg-slate-700 rounded transition">출근자 건강 정보조회</a>
        <a href="#settings" className="block py-2 px-3 hover:bg-slate-700 rounded transition">보건 상담</a>
        <a href="#settings" className="block py-2 px-3 hover:bg-slate-700 rounded transition">건강검진</a>
        <a href="/hospital/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">병원 관리</a>
        <a href="/notice/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">공지사항</a>
        <a href="/employee/list" className="block py-2 px-3 hover:bg-slate-700 rounded transition">직원 관리</a>
        <a href="#settings" className="block py-2 px-3 hover:bg-slate-700 rounded transition">시스템</a>
      </nav>
    </div>
    );
}