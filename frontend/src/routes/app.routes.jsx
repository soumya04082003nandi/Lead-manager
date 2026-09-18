import {Routes ,Route} from "react-router-dom";


const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path="/login" element={<h1>Login page</h1>} />
            <Route path="/register" element= {<h1>Register page</h1>}></Route>
            <Route path="/dashboard" element= {<h1>Dashboard page</h1>}></Route>

        </Routes>
    );
};

export default AppRoutes;