import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserInfo, useAuthStore } from "../../store/useAuthStore";
import "../styles/sidebar.css";

export default function Sidebar() {
  const user = useUserInfo();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({
    consultation: true,
    checkups: true,
    hospitals: true,
    notices: false,
    employees: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div>
          <h1>
            Health<span>Gate</span>
          </h1>
          <p>물류현장 보건 관리 시스템</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">Main</p>

        <div className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
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
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
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
          </NavLink>
        </div>

        <p className="sidebar-section-title">Health Management</p>

        <div className="sidebar-menu">
          {/* 보건 상담 */}
          <div>
            <button
              type="button"
              className="sidebar-menu-heading"
              onClick={() => toggleMenu("consultation")}
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
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <span>보건 상담</span>

              <span
                className={`submenu-arrow ${
                  openMenus.consultation ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`sidebar-submenu-wrapper ${
                openMenus.consultation ? "open" : ""
              }`}
            >
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/consultation/reservation/list">
                    상담 예약 조회
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/consultation/reservation">
                    상담 예약 신청
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/consultation/list">
                    상담 내역 조회
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* 건강검진 관리 */}
          <div>
            <button
              type="button"
              className="sidebar-menu-heading"
              onClick={() => toggleMenu("checkups")}
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

              <span>건강검진</span>

              <span
                className={`submenu-arrow ${
                  openMenus.checkups ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`sidebar-submenu-wrapper ${
                openMenus.checkups ? "open" : ""
              }`}
            >
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/checkup/statistics">
                    검진 완료율 통계
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/checkup/targets">
                    검진 대상자 목록
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/checkup/reminder-settings">
                    자동 알림 설정
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/checkup/reminders/history">
                    알림 발송 이력
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* 병원 관리 */}
          <div>
            <button
              type="button"
              className="sidebar-menu-heading"
              onClick={() => toggleMenu("hospitals")}
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
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <span>병원 관리</span>

              <span
                className={`submenu-arrow ${
                  openMenus.hospitals ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`sidebar-submenu-wrapper ${
                openMenus.hospitals ? "open" : ""
              }`}
            >
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/hospital/list">병원 조회</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="sidebar-section-title">Management</p>

        <div className="sidebar-menu">
          {/* 공지사항 */}
          <div>
            <button
              type="button"
              className="sidebar-menu-heading"
              onClick={() => toggleMenu("notices")}
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
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <span>공지사항</span>

              <span
                className={`submenu-arrow ${
                  openMenus.notices ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`sidebar-submenu-wrapper ${
                openMenus.notices ? "open" : ""
              }`}
            >
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/notice/list">공지사항 조회</NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* 직원 관리 */}
          <div>
            <button
              type="button"
              className="sidebar-menu-heading"
              onClick={() => toggleMenu("employees")}
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
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <span>직원 관리</span>

              <span
                className={`submenu-arrow ${
                  openMenus.employees ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`sidebar-submenu-wrapper ${
                openMenus.employees ? "open" : ""
              }`}
            >
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/employees">직원 조회</NavLink>
                </li>

                <li>
                  <NavLink to="/employees/new">직원 등록</NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* 시스템 */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
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

              <circle cx="12" cy="8.8" r="2.5" />
            </svg>

            시스템
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-user">
        {user ? (
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">
              {user.name?.charAt(0)}
            </div>

            <div className="sidebar-user-text">
              <p>{user.name}님</p>
              <span>보건관리자</span>
            </div>

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
          <NavLink to="/login" className="sidebar-login">
            로그인
          </NavLink>
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