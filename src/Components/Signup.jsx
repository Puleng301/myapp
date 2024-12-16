// Signup.js
import  { useState } from 'react';
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';


const Signup = ({ setUsers, onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
   
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        const newUser = { username, password };
        setLoading(true)
        try{
           
            const register = await axios.post('/register',newUser)
            setUsername('');
            setPassword('');
            setLoading(false)
            navigate("/login");
        } catch(err){
            setLoading(false)
            console.log(err)
        }
        
    };

    return (
        <div className='login'>
            <form className='login-container' onSubmit={handleSignup}>
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
                <button className="button" disabled={loading} type="submit">{loading?'Registering...':'Sign Up'}</button>
            </form>
            <div>Have already registered? <Link to={'/login'}>Login</Link></div>
        </div>
    );
};

export default Signup;
