import "./App.css";

import { Route, Routes, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";


import LoginComponent from "./login/components/LoginComponent";
import DashboardComponent from "./dashboard/DashboardComponent";

import EmployeeListComponent from "./employee/components/EmployeeListComponent";
import EmployeeCreateComponent from "./employee/components/EmployeeCreateComponent";
import EmployeeDetailComponent from "./employee/components/EmployeeDetailComponent";
import EmployeeUpdateComponent from "./employee/components/EmployeeUpdateComponent";

import HospitalListComponent from "./hospital/components/HospitalListComponent";
import HospitalCreateComponent from "./hospital/components/HospitalCreateComponent";
import HospitalDetailComponent from "./hospital/components/HospitalDetailComponent";
import HospitalUpdateComponent from "./hospital/components/HospitalUpdateComponent";

import NoticeListComponent from "./notice/components/NoticeListComponent";
import NoticeCreateComponent from "./notice/components/NoticeCreateComponent";
import NoticeDetailComponent from "./notice/components/NoticeDetailComponent";
import NoticeUpdateComponent from "./notice/components/NoticeUpdateComponent";

import ReservationListComponent from './consultation/reservations/components/ReservationListComponent';
import ReservationComponent from './consultation/reservations/components/ReservationComponent';
import ReservationDetailComponent from './consultation/reservations/components/ReservationDetailComponent';
import ConsultationListComponent from './consultation/consultations/components/ConsultationListComponent';
import ConsultationDetailComponent from './consultation/consultations/components/ConsultationDetailComponent';
import ConsultationComponent from './consultation/consultations/components/ConsultationComponent';

import MyPageComponent from "./login/components/MyPageComponent";
import BioInputComponent from "./bioinput/components/BioInputComponent";

import CheckupStatisticsComponent from "./checkup/components/CheckupStatisticsComponent";
import CheckupTargetListComponent from "./checkup/components/CheckupTargetListComponent";
import CheckupReminderSettingComponent from "./checkup/components/CheckupReminderSettingComponent";
import CheckupReminderHistoryComponent from "./checkup/components/CheckupReminderHistoryComponent";
import AttendanceListComponent from "./attendance/components/AttendanceListComponent";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { SiteHeader } from "./components/site-header";
import PrivateRoute from "./common/components/PrivateRoute";
import ChangePasswordComponent from "./login/components/ChangePasswordComponent";
import TodaySafetyBriefingPage from "./safety/components/TodaySafetyBriefingPage";

function App() {
  const location = useLocation();

  //로그인 화면 시 사이드바 + 헤더는 보이지 않음
  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen w-full">


      <AppSidebar />
      <SidebarInset>
        <SiteHeader/>
        <Routes>

          {/* 로그인 해야만 들어갈 수 있는 페이지 */}
          <Route element={<PrivateRoute/>}>

            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/mypage" element={<MyPageComponent/>} />
            <Route path="/mypage/password" element={<ChangePasswordComponent/>} />
            <Route path="/attendance" element={<AttendanceListComponent/>}/>
            <Route path="/bioinput" element={<BioInputComponent/>} />
            <Route path="/safety-briefings/today" element={<TodaySafetyBriefingPage />} />

            {/* 공지사항 */}
            <Route path="/notices/list" element={<NoticeListComponent />} />
            <Route path="/notices/new" element={<NoticeCreateComponent />} />
            <Route path="/notices/:noticeId" element={<NoticeDetailComponent />} />
            <Route path="/notices/:noticeId/edit" element={<NoticeUpdateComponent />} />
            {/* 병원 관리 */}
            <Route path="/hospitals/list" element={<HospitalListComponent />} />
            <Route path="/hospitals/new" element={<HospitalCreateComponent />} />
            <Route path="/hospitals/:id" element={<HospitalDetailComponent />} />
            <Route path="/hospitals/:id/edit" element={<HospitalUpdateComponent />} />
          </Route>

          {/* 인사관리자만 접근 가능한 페이지 */}
          <Route element={<PrivateRoute allowedRoles={['HR_ADMIN']}/>}>
          </Route>

          {/* 보건관리자만 접근 가능한 페이지 */}
          <Route element={<PrivateRoute allowedRoles={['HEALTH_ADMIN']}/>}>
            {/* 보건 상담 */}
            <Route path="/consultation/reservation/list" element={<ReservationListComponent />} />
            <Route path="/consultation/reservation/:id?" element={<ReservationComponent />} />
            <Route path="/consultation/reservation/detail/:id" element={<ReservationDetailComponent />} />
            <Route path="/consultation/list" element={<ConsultationListComponent />} />
            <Route path="/consultation/detail/:id" element={<ConsultationDetailComponent />} />
            <Route path="/consultation/:id" element={<ConsultationComponent />} />

            {/* 건강검진 관리 */}
            <Route path="/checkup/statistics" element={<CheckupStatisticsComponent />} />
            <Route path="/checkup/targets" element={<CheckupTargetListComponent />}/>
            <Route path="/checkup/reminder-settings" element={<CheckupReminderSettingComponent />} />
            <Route path="/checkup/reminders/history" element={<CheckupReminderHistoryComponent />} />
            <Route path="/checkup/list" element={<Navigate to="/checkup/targets" replace />} />
          </Route>


          {/* 보건관리자, 인사관리자 접근 가능한 페이지 */}
          <Route element={<PrivateRoute allowedRoles={['HR_ADMIN', 'HEALTH_ADMIN']}/>}>
            {/* 직원 관리 */}
            <Route path="/employees" element={<EmployeeListComponent />} />
            <Route path="/employees/:id" element={<EmployeeDetailComponent />} />
            <Route path="/employees/:id/edit" element={<EmployeeUpdateComponent />} />
            <Route path="/employees/new" element={<EmployeeCreateComponent />} />
          </Route>
        </Routes>

      </SidebarInset>

    </div>
  );
}

export default App;