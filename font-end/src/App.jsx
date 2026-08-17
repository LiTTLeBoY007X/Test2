axios.defaults.withCredentials = true;
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import UserRegister from './Components/register';
import UserLogin from './Components/login';
import IndexScore from './Components/index';
import Shop from './Components/Shop';
import HistoryNot from './Components/history';


function App() {

  return (
  <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<IndexScore />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/history" element={<HistoryNot />} />
          {/* หน้าแรก (http://localhost:5173/) ให้โชว์หน้าสมัครสมาชิก */}
          <Route path='/register' element={<UserRegister />} />

          {/* หน้า Login (http://localhost:5173/login) ให้โชว์หน้า Login */}
          <Route path='/login' element={<UserLogin />} />

        </Routes>
      </main>

    
    </BrowserRouter>
    
    )
    
}

export default App