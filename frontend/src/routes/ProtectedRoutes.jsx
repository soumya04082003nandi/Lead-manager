import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const navigate=useNavigate();

    if (loading) {
        return (
            <p>Checking Authentication...</p>
        )
    }


    if (!user) {
            navigate("/login");
            
    }

    return <Outlet />
}

export default ProtectedRoute;