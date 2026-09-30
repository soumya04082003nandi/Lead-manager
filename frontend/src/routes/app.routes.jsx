import {Routes ,Route} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Leads from "../pages/Leads";
import Dashboard from "../pages/Dashboard";
import LeadDetails from "../pages/LeadDetails";
import ProtectedRoute from "./protectedRoutes";
import AppLayout from "../components/AppLayout";


const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path="/" element={<h1>Landing page</h1>}></Route>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element= {<Register/>}></Route>

            <Route element={<ProtectedRoute />} >
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetails />}></Route>
                </Route>
            </Route>



        </Routes>
    );
};

export default AppRoutes;