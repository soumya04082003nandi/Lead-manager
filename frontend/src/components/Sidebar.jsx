import { NavLink } from "react-router-dom";

const Sidebar = ()=>{
    return (
        <aside>
            <h3>Menu</h3>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/leads">
                    Leads
                </NavLink>
            </nav>
        </aside>

    )
}

export default Sidebar;