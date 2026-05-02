import './App.css'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/Profile'
import {Routes,Route} from 'react-router'

function App() {
  
  return(
    <>
    <Routes>
      <Route index element={ <HomePage/>}/>
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
    
    </>
    
   

  )
}

export default App
