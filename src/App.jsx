import './App.css'
import Sidebar from './common/components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EmployeeListComponent from './employee/components/EmployeeListComponent'

function App() {

  return (
    <div className='flex'>
      <Sidebar/>


      <div>
        <Routes>
          <Route path="/employee/list" element={<EmployeeListComponent/>}/>
        </Routes>
      </div>

    </div>
  
  )
}

export default App
