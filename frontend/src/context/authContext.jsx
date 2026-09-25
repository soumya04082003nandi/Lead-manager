import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser,loginUser } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();
            console.log(response);
            

            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // login user
    const login = async(credential)=>{
        const response = await loginUser(credential);

        await checkAuth();

        return response
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkAuth,
                login,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
