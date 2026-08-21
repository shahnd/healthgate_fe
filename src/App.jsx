import "./App.css";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./common/components/Sidebar";

import LoginComponent from "./login/components/LoginComponent";
import MyPageComponent from "./login/components/MyPageComponent";

import DashboardComponent from "./dashboard/DashboardComponent";
import BioInputComponent from "./bioinput/components/BioInputComponent";

import EmployeeListComponent from "./employee/components/EmployeeListComponent";
import EmployeeCreateComponent from "./employee/components/EmployeeCreateComponent";
import EmployeeDetailComponent from "./employee/components/EmployeeDetailComponent";
import EmployeeUpdateComponent from "./employee/components/EmployeeUpdateComponent";

import HospitalListComponent from "./hospital/components/HospitalListComponent";
import HospitalEnrollFormComponent from "./hospital/components/HospitalEnrollFormComponent";
import HospitalDetailComponent from "./hospital/components/HospitalDetailComponent";
import HospitalUpdateFormComponent from "./hospital/components/HospitalUpdateFormComponent";

import NoticeListComponent from "./notice/components/NoticeListComponent";

import ReservationListComponent from "./consultation/reservations/components/ReservationListComponent";
import ReservationComponent from "./consultation/reservations/components/ReservationComponent";

// import ConsultationListComponent
//   from "./consultation/consultations/components/ConsultationListComponent";

/*
 * 건강검진 관리 화면
 */
import CheckupStatisticsComponent
  from "./checkup/components/CheckupStatisticsComponent";

import CheckupTargetListComponent
  from "./checkup/components/CheckupTargetListComponent";

import CheckupReminderSettingComponent
  from "./checkup/components/CheckupReminderSettingComponent";

import CheckupReminderHistoryComponent
  from "./checkup/components/CheckupReminderHistoryComponent";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-slate-50">
        <Routes>
          {/* 로그인 및 대시보드 */}
          <Route
            path="/login"
            element={<LoginComponent />}
          />

          <Route
            path="/dashboard"
            element={<DashboardComponent />}
          />

          <Route
            path="/mypage"
            element={<MyPageComponent />}
          />

          <Route
            path="/bioinput"
            element={<BioInputComponent />}
          />

          {/* 병원 관리 */}
          <Route
            path="/hospital/list"
            element={<HospitalListComponent />}
          />

          <Route
            path="/hospital/new"
            element={<HospitalEnrollFormComponent />}
          />

          <Route
            path="/hospital/:id"
            element={<HospitalDetailComponent />}
          />

          <Route
            path="/hospital/:id/edit"
            element={<HospitalUpdateFormComponent />}
          />

          {/* 공지사항 */}
          <Route
            path="/notice/list"
            element={<NoticeListComponent />}
          />

          {/* 직원 관리 */}
          <Route
            path="/employees"
            element={<EmployeeListComponent />}
          />

          <Route
            path="/employees/:id"
            element={<EmployeeDetailComponent />}
          />

          <Route
            path="/employees/:id/edit"
            element={<EmployeeUpdateComponent />}
          />

          <Route
            path="/employees/new"
            element={<EmployeeCreateComponent />}
          />

          {/* 보건 상담 */}
          <Route
            path="/consultation/reservation/list"
            element={<ReservationListComponent />}
          />

          <Route
            path="/consultation/reservation"
            element={<ReservationComponent />}
          />

          {/*
          <Route
            path="/consultation/list"
            element={<ConsultationListComponent />}
          />
          */}

          {/* 건강검진 완료율 통계 */}
          <Route
            path="/checkup/statistics"
            element={<CheckupStatisticsComponent />}
          />

          {/* 건강검진 대상자 목록 */}
          <Route
            path="/checkup/targets"
            element={<CheckupTargetListComponent />}
          />

          {/* 건강검진 자동 알림 설정 */}
          <Route
            path="/checkup/reminder-settings"
            element={<CheckupReminderSettingComponent />}
          />

          {/* 건강검진 알림 발송 이력 */}
          <Route
            path="/checkup/reminders/history"
            element={<CheckupReminderHistoryComponent />}
          />

          {/*
           * 예전에 사용하던 /checkup/list 주소로 접속하면
           * 검진 대상자 목록 화면으로 자동 이동한다.
           */}
          <Route
            path="/checkup/list"
            element={
              <Navigate
                to="/checkup/targets"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;