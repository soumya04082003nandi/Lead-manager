import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return <h1>Loading....</h1>;
    }

    if (!user) {
        return <h1>You are not logged in</h1>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p> 

            <button onClick={logout}>
                logout
            </button>
        </div>
    );
};

export default Dashboard;