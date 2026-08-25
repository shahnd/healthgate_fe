import "./App.css";

import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Sidebar from "./common/components/Sidebar";

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

import ReservationListComponent from './consultation/reservations/components/ReservationListComponent'
import ReservationComponent from './consultation/reservations/components/ReservationComponent'
import ConsultationListComponent from './consultation/consultations/components/ConsultationListComponent';
import ReservationDetailComponent from './consultation/reservations/components/ReservationDetailComponent'

import MyPageComponent from "./login/components/MyPageComponent";
import BioInputComponent from "./bioinput/components/BioInputComponent";

import CheckupStatisticsComponent from "./checkup/components/CheckupStatisticsComponent";
import CheckupTargetListComponent from "./checkup/components/CheckupTargetListComponent";
import CheckupReminderSettingComponent from "./checkup/components/CheckupReminderSettingComponent";
import CheckupReminderHistoryComponent from "./checkup/components/CheckupReminderHistoryComponent";
import AttendanceListComponent from "./attendance/components/AttendanceListComponent";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInset } from "./components/ui/sidebar";

function App() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar/>

      <SidebarInset>
        <main className="min-w-0 flex-1 bg-slate-50">
          <Routes>
            {/* 로그인 및 대시보드 */}
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/mypage" element={<MyPageComponent/>} />
            <Route path="/attendance" element={<AttendanceListComponent/>}/>

            <Route path="/bioinput" element={<BioInputComponent/>} />

            {/* 병원 관리 */}
            <Route path="/hospitals/list" element={<HospitalListComponent />} />
            <Route path="/hospitals/new" element={<HospitalCreateComponent />} />
            <Route path="/hospitals/:id" element={<HospitalDetailComponent />} />
            <Route path="/hospitals/:id/edit" element={<HospitalUpdateComponent />} />

            {/* 공지사항 */}
            <Route path="/notice/list" element={<NoticeListComponent />} />

            {/* 직원 관리 */}
            <Route path="/employees" element={<EmployeeListComponent />} />
            <Route path="/employees/:id" element={<EmployeeDetailComponent />} />
            <Route
              path="/employees/:id/edit"
              element={<EmployeeUpdateComponent />}
            />
            <Route path="/employees/new" element={<EmployeeCreateComponent />} />

            {/* 보건 상담 */}
            <Route path="/consultation/reservation/list" element={<ReservationListComponent />} />
            <Route path="/consultation/reservation/:id?" element={<ReservationComponent />} />
            <Route path="/consultation/reservation/detail/:id" element={<ReservationDetailComponent />} />
            <Route path="/consultation/list" element={<ConsultationListComponent />} />

            {/* 건강검진 관리 */}
            <Route
              path="/checkup/statistics"
              element={<CheckupStatisticsComponent />}
            />
            <Route
              path="/checkup/targets"
              element={<CheckupTargetListComponent />}
            />
            <Route
              path="/checkup/reminder-settings"
              element={<CheckupReminderSettingComponent />}
            />
            <Route
              path="/checkup/reminders/history"
              element={<CheckupReminderHistoryComponent />}
            />
            <Route
              path="/checkup/list"
              element={<Navigate to="/checkup/targets" replace />}
            />
          </Routes>
        </main>
      </SidebarInset>
    </div>
  );
}

export default App;