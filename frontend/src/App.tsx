import './App.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/Profile'
import {Routes,Route} from 'react-router'

function App() {
  
  return(
    <>
    <Routes>
      <Route index element={ <HomePage/>}/>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
    
    </>
    
   

  )
}

export default App
