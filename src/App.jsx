import "./App.css";

import { Route, Routes } from "react-router-dom";

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

import ReservationListComponent from "./consultation/reservations/components/ReservationListComponent";
import ReservationComponent from "./consultation/reservations/components/ReservationComponent";
// import ConsultationListComponent from "./consultation/consultations/components/ConsultationListComponent";

import CheckupManagementComponent from "./checkup/components/CheckupManagementComponent";
import MyPageComponent from "./login/components/MyPageComponent";
import BioInputComponent from "./bioinput/components/BioInputComponent";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-slate-50">
        <Routes>
          {/* 로그인 및 대시보드 */}
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/mypage" element={<MyPageComponent/>} />

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
          <Route
            path="/consultation/reservation/list"
            element={<ReservationListComponent />}
          />
          <Route
            path="/consultation/reservation"
            element={<ReservationComponent />}
          />
          {/* <Route
            path="/consultation/list"
            element={<ConsultationListComponent />}
          /> */}

          {/* 건강검진 관리 */}
          <Route
            path="/checkup/list"
            element={<CheckupManagementComponent />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;