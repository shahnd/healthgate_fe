import { useNavigate } from "react-router-dom";
import { useUserInfo, useAuthStore } from "../../store/useAuthStore";
import "../styles/sidebar.css";

export default function Sidebar() {
  const user = useUserInfo();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logout();
    alert("로그아웃 되었습니다.");
  };

  return (
    <aside className="sidebar">
      {/* 로고 영역 */}
      <div className="sidebar-logo">
        <div>
          <h1>
            Health<span>Gate</span>
          </h1>
          <p>물류현장 보건 관리 시스템</p>
        </div>
      </div>

      {/* 메뉴 */}
      <nav className="sidebar-nav">
        {/* 주요 메뉴 */}
        <p className="sidebar-section-title">
          Main
        </p>

        <div className="sidebar-menu">
          {/* 활성 메뉴 */}
          <a
            href="/dashboard"
            className="sidebar-menu-item active"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9 9 9M5 10v10h14V10"
              />
            </svg>
            대시보드
          </a>

          {/* 일반 메뉴 */}
          <a
            href="#profile"
            className="sidebar-menu-item"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21a7 7 0 0114 0"
              />
            </svg>
            출근자 건강 정보
          </a>
        </div>

        {/* 보건관리 */}
        <p className="sidebar-section-title">
          Health Management
        </p>

        <div className="sidebar-menu">
          {/* 보건 상담 */}
          <div>
            <div className="sidebar-menu-heading">
              <svg
                className="sidebar-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              보건 상담
            </div>

            <ul className="sidebar-submenu">
              <li>
                <a href="/consultation/reservation/list">
                  상담 예약 조회
                </a>
              </li>

              <li>
                <a href="/consultation/reservation">
                  상담 예약 신청
                </a>
              </li>

              <li>
                <a href="/consultation/list">
                  상담 내역 조회
                </a>
              </li>
            </ul>
          </div>

          {/* 건강검진 */}
          <a
            href="/checkup/list"
            className="sidebar-menu-item"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5h6M9 3h6a1 1 0 011 1v1h2a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2V4a1 1 0 011-1z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6M9 17h4"
              />
            </svg>
            건강검진
          </a>

          {/* 병원 관리 */}
          <a
            href="/hospitals/list"
            className="sidebar-menu-item"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M5 21V6a2 2 0 012-2h10a2 2 0 012 2v15M9 8h6M9 12h6M9 16h6"
              />
            </svg>
            병원 관리
          </a>
        </div>

        {/* 운영관리 */}
        <p className="sidebar-section-title">
          Management
        </p>

        <div className="sidebar-menu">
          {/* 공지사항 */}
          <a
            href="/notice/list"
            className="sidebar-menu-item"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 4v5h5"
              />
            </svg>
            공지사항
          </a>

          {/* 직원 관리 */}
          <div>
            <div className="sidebar-menu-heading">
              <svg
                className="sidebar-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              직원 관리
            </div>

            <ul className="sidebar-submenu">
              <li>
                <a href="/employees">
                  직원 조회
                </a>
              </li>

              <li>
                <a href="/employees/new">
                  직원 등록
                </a>
              </li>
            </ul>
          </div>

          {/* 시스템 */}
          <a
            href="#settings"
            className="sidebar-menu-item"
          >
            <svg
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.3 3.2l.7-1.2h2l.7 1.2 1.5.6 1.3-.5 1.4 1.4-.5 1.3.6 1.5 1.2.7v2l-1.2.7-.6 1.5.5 1.3-1.4 1.4-1.3-.5-1.5.6-.7 1.2h-2l-.7-1.2-1.5-.6-1.3.5-1.4-1.4.5-1.3-.6-1.5-1.2-.7v-2l1.2-.7.6-1.5-.5-1.3L6.8 3.3l1.3.5 1.5-.6z"
              />
              <circle
                cx="12"
                cy="8.8"
                r="2.5"
              />
            </svg>
            시스템
          </a>
        </div>
      </nav>

      {/* 사용자 영역 */}
      <div className="sidebar-user">
        {user ? (
          <div className="sidebar-user-info">
            {/* 프로필 아이콘 */}
            <div className="sidebar-avatar">
              {user.name?.charAt(0)}
            </div>

            <div className="sidebar-user-text">
              <p>{user.name}님</p>
              <span>보건관리자</span>
            </div>

            {/* 마이페이지 */}
            <button
              type="button"
              onClick={() => navigate("/mypage")}
              title="마이페이지"
              className="sidebar-mypage-button"
            >
              <svg
                className="sidebar-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5v.2h-2.6v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H7v-2.6h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V5h2.6v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1h.2v2.6h-.2a1.7 1.7 0 00-1.5 1z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="sidebar-login"
          >
            로그인
          </a>
        )}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout"
          >
            로그아웃
          </button>
        )}
      </div>
    </aside>
  );
}