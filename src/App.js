
import Header from './Components/Header';
import Login from './Components/Login';
import ProductManagemet from './Components/ProductManagement';
import Dashboard from './Components/Dashboard';
import UserManagement from './Components/UserManagement';
import Signup from './Components/Signup';
import { Route, Routes, useLocation } from 'react-router-dom';
import PersistAuth from './Components/PersistAuth';
import './App.css'


const App = () => {
  const location = useLocation().pathname
  return(
  <div className='App'>
    <Header headingText={'Stock inventory system for Wings Cafe'}/>
    <Routes>
      <Route index element={<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='' element={<Login/>}>
      </Route>
      <Route path='/register' element={<Signup/>}/>
      <Route element={<PersistAuth/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/products' element={<ProductManagemet/>}/>
        <Route path='/users' element={<UserManagement/>}/>
      </Route>
    </Routes>
  </div>

  )

}

export default App;

