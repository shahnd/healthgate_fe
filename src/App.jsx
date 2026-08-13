import './App.css'

import { Route, Routes } from 'react-router-dom'

import Sidebar from './common/components/Sidebar'

import EmployeeListComponent
  from './employee/components/EmployeeListComponent'

import HospitalListComponent
  from './hospital/components/HospitalListComponent'

import NoticeListComponent
  from './notice/components/NoticeListComponent'

import LoginComponent
  from './login/components/LoginComponent'

import DashboardComponent
  from './dashboard/DashboardComponent'

import CheckupManagementComponent
  from './checkup/components/CheckupManagementComponent'

function App() {
  return (
    <div className="flex min-h-screen">
      {/* 공통 사이드바 */}
      <Sidebar />

      {/* 페이지 콘텐츠 영역 */}
      <main className="min-w-0 flex-1 bg-slate-50">
        <Routes>
          {/* 로그인 */}
          <Route
            path="/login"
            element={<LoginComponent />}
          />

          {/* 대시보드 */}
          <Route
            path="/dashboard"
            element={<DashboardComponent />}
          />

          {/* 병원 관리 */}
          <Route
            path="/hospital/list"
            element={<HospitalListComponent />}
          />

          {/* 공지사항 */}
          <Route
            path="/notice/list"
            element={<NoticeListComponent />}
          />

          {/* 직원 관리 */}
          <Route
            path="/employee/list"
            element={<EmployeeListComponent />}
          />

          {/* 건강검진 관리 */}
          <Route
            path="/checkup/list"
            element={<CheckupManagementComponent />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App