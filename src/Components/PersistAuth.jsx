import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/use-auth"
import useRefreshToken from "../hooks/useRefreshToken"
import { useState,useEffect } from "react"
import useFetchData from "../hooks/useFetchData"
import useAxiosIntercepters from "../hooks/useAxiosIntercepters"
import { jwtDecode } from "jwt-decode";


function PersistAuth() {
    
    const [loading,setLoading] = useState(true)
    const {auth,user,setUser} = useAuth()
    const axios = useAxiosIntercepters()
    const refresh = useRefreshToken()
    const {data} = useFetchData('/logged_user')
    
    useEffect(()=>{
        let mounted = true
        const generateNewAccess = async () =>{
            try{
                 await refresh()
            } catch(err) {
                console.log(err)
            }finally{
                mounted && setLoading(false)
            }
        }

        !auth?.accessToken ?  generateNewAccess() : setLoading(false)
        return ()=>{
            mounted = false
        }
    },[])
   useEffect(()=>{
    if (auth?.accessToken) {
        setUser(jwtDecode(auth?.accessToken))
    }
   },[auth])
    console.log('logged as',user)
  
  return (
    loading ? 
    <div maxWidth="lg" style={{ marginTop: '20px',height:'100vh',overflow:'hidden' }}> 
       Loading...
    </div> 
    : 
    auth?.accessToken 
    ? 
    <Outlet/>
    :
    <Navigate to={'/login'} replace/>
  )
}

export default PersistAuth