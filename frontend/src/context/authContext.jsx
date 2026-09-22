import {Children, createContext,useContext,useEffect,useState} from "react"
import {getCurrentUser} from "../services/auth.api"


const AuthContext = createContext();

export const AuthProvider = ({Children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async ()=>{
        try {
            const response = await getCurrentUser();

            setUser(response.data.user)
            
        } catch (error) {
            setUser(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        checkAuth();
    },[]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkAuth,
            }}
        >
            {Children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}