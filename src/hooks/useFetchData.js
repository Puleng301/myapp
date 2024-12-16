import { useEffect, useState } from 'react'
import useAxiosIntercepters from './useAxiosIntercepters';
import useAuth from './use-auth';

function useFetchData(url,dep=[]) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState()
  const axios = useAxiosIntercepters()
    const {auth} =useAuth()
  useEffect(()=>{
        let mounted = true;
        const controller = new AbortController()
        if(auth?.accessToken) {
            const getData= async() => {
                try{
                    const res = await axios.get(url,{
                        signal:controller.signal,
                        withCredentials:true
                    })
                    mounted && setData(res.data)
                   mounted && setLoading(false) 
                }catch(err) {
                    setError(err)
                    setLoading(false)
                    console.log(err)
                }
                
            }
            getData()
        }
        return ()=>{
            mounted = false
            controller.abort()
        }
    },dep)
    return {data,loading,error}
}

export default useFetchData