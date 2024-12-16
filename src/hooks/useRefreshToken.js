import axios from '../api/axios'
import useAuth from './use-auth'

function useRefreshToken() {
    const {setAuth} = useAuth()

    const refresh = async ()=> {
        const res = await axios.get('/refresh',{
            withCredentials:true
        })
        setAuth(prev=>{
            return {
                ...prev,
                accessToken:res?.data?.accessToken,
            }
        })
        return res?.data
    }
  return refresh
}

export default useRefreshToken