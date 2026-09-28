import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <p>Checking Authentication...</p>
        )
    }


    if (!user) {
        return (
            // <Navigate to={"/login"} replace />
            <p>login first</p>
        )
    }

    return <Outlet />
}

export default ProtectedRoute;