import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();

            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;