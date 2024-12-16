import {useContext} from 'react'
import { AuthContext } from '../context/AuthProvider'

function useAuth() {
    const authData = useContext(AuthContext)
  return authData
}

export default useAuth