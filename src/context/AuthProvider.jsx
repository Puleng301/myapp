import { createContext,useState } from "react"

export const AuthContext = createContext(null)

function AuthProvider({children}) {
  const [auth,setAuth]= useState({})
  const [user,setUser]= useState({})
  return (
    <AuthContext.Provider value={{auth,setAuth,user,setUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider