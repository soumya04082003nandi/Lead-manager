import { useAuth } from "../hooks/useAuth";

const Navbar =()=>{
    const {user, logout}= useAuth();

    return (
        <nav>
            <div>
                <h2>Lead Manager</h2>
            </div>

            <div>
                <span>
                    {user?.name}
                </span>

                <span>
                    {user?.role}
                </span>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;