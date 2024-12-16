// Login.js
import { useState } from 'react';
import './Login.css'
import { useNavigate,Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/use-auth'
//import pic1 from './Assets/pic2.jpeg'



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setAuth} = useAuth()
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true)
        setErrorMsg('');
        try{
            const accessToken = await axios.post('/login',{username,password},{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            })
            setAuth(accessToken.data)
            setLoading(false)
            navigate("/dashboard"); 
        } catch (err){
            setErrorMsg(err?.response?.data)
            setLoading(false)
            console.log('Error:',err)
        }
        
    };

    return (
        <div className='login'>
            <form className='login-container' onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button disabled={loading} className="button"type="submit">{loading?'Logging...':'Log In'}</button>
            </form>
            {errorMsg && <div className="error-message">{errorMsg}</div>}
        <div>Have not registered just yet? <Link to={'/register'}>Register</Link></div>
        </div>
    ); 
};

export default Login; 