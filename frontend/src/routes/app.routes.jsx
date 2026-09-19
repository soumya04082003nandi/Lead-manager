import {Routes ,Route} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Leads from "../pages/Leads";
import Dashboard from "../pages/Dashboard";
import LeadDetails from "../pages/LeadDetails";


const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element= {<Register/>}></Route>
            <Route path="/dashboard" element= {<Dashboard/>}></Route>
            <Route path="/leads" element={<Leads/>}/>
            <Route path="/leads/:id" element={<LeadDetails/>}></Route>

        </Routes>
    );
};

export default AppRoutes;