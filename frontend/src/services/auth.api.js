import api from "./api";    


//register user
export const registerUser = (userData)=>{
    return api.post("/auth/register", userData);
}


//login user
export const loginUser = (userData)=>{
    return api.post("/auth/login", userData)
}

//logut user 
export const logoutUser = ()=>{
    return api.get("/auth/logout")
}

//get the current data
export const getCurrentUser = ()=>{
    return api.get("/auth/me")
}