import useAuth from "./use-auth"
import { axiosIntercepter } from "../api/axios"
import { useEffect } from "react"
import useRefreshToken from "./useRefreshToken"

const useAxiosIntercepters = () => {
    const {auth} =useAuth()
    const refresh = useRefreshToken()


    useEffect(()=>{
        const requestIntercepters = axiosIntercepter.interceptors.request.use(
            config =>{
                if (!config.headers.Authorization) {
                    config.headers.Authorization = 'Bearer '+auth.accessToken
                }
                return config
            },(err)=> Promise.reject(err)
        )

        const responseIntercepters = axiosIntercepter.interceptors.response.use(
            response=>response,
            async (err)=> {
                const prevRequest = err?.config
                if(err?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken =await refresh()
                    prevRequest.headers.Authorization = 'Bearer '+newAccessToken.accessToken
                    return axiosIntercepter(prevRequest)
                }
                return Promise.reject(err)
            }

        )
        return () =>{
            axiosIntercepter.interceptors.request.eject(requestIntercepters)
            axiosIntercepter.interceptors.response.eject(responseIntercepters)
        }
    },[auth,refresh])
    
  return axiosIntercepter
}

export default useAxiosIntercepters