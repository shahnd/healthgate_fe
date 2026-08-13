import './App.css'
import Sidebar from './common/components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EmployeeListComponent from './employee/components/EmployeeListComponent'
import HospitalListComponent from './hospital/components/HospitalListComponent'
import NoticeListComponent from './notice/components/NoticeListComponent'
import LoginComponent from './login/components/LoginComponent'
import DashboardComponent from './dashboard/DashboardComponent'

function App() {

  return (
    <div className='flex'>
      <Sidebar/>

      <div>
        <Routes>
          <Route path="/login" element={<LoginComponent/>}/>
          <Route path="/dashboard" element={<DashboardComponent/>}/>
          <Route path="/hospital/list" element={<HospitalListComponent/>}/>
          <Route path="/notice/list" element={<NoticeListComponent/>}/>
          <Route path="/employee/list" element={<EmployeeListComponent/>}/>
        </Routes>
      </div>

    </div>
  
  )
}

export default App
