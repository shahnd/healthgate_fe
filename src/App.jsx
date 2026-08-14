import './App.css'
import Sidebar from './common/components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EmployeeListComponent from './employee/components/EmployeeListComponent'

import HospitalListComponent from './hospital/components/HospitalListComponent'
import HospitalEnrollFormComponent from './hospital/components/HospitalEnrollFormComponent'
import HospitalDetailComponent from './hospital/components/HospitalDetailComponent'
import HospitalUpdateFormComponent from './hospital/components/HospitalUpdateFormComponent'

import NoticeListComponent from './notice/components/NoticeListComponent'
import LoginComponent from './login/components/LoginComponent'
import DashboardComponent from './dashboard/DashboardComponent'
import EmployeeCreateComponent from './employee/components/EmployeeCreateComponent'
import EmployeeDetailComponent from './employee/components/EmployeeDetailComponent'
import EmployeeUpdateComponent from './employee/components/EmployeeUpdateComponent'
import ReservationListComponent from './consultation/reservations/components/ReservationListComponent'
import ReservationComponent from './consultation/reservations/components/ReservationComponent'
import ConsultationListComponent from './consultation/consultations/components/ConsultationListComponent';

function App() {

  return (
    <div className='flex'>
      <Sidebar/>

      <div>
        <Routes>
          <Route path="/login" element={<LoginComponent/>}/>
          <Route path="/dashboard" element={<DashboardComponent/>}/>

          <Route path="/hospital/list" element={<HospitalListComponent/>}/>
          <Route path="/hospital/new" element={<HospitalEnrollFormComponent/>}/>
          <Route path="/hospital/:id" element={<HospitalDetailComponent/>}/>
          <Route path="/hospital/:id/edit" element={<HospitalUpdateFormComponent/>}/>

          <Route path="/notice/list" element={<NoticeListComponent/>}/>
          <Route path="/employees" element={<EmployeeListComponent/>}/>
          <Route path="/employees/:id" element={<EmployeeDetailComponent/>}/>
          <Route path="/employees/:id/edit" element={<EmployeeUpdateComponent/>}/>
          <Route path="/employees/new" element={<EmployeeCreateComponent/>}/>

          <Route path="/consultation/reservation/list" element={<ReservationListComponent />} />
          <Route path="/consultation/reservation" element={<ReservationComponent />} />
          <Route path="/consultation/list" element={<ConsultationListComponent />} />
          
        </Routes>
      </div>
    </div>
  
  )
}

export default App
