import api from "./api"

//create public lead
export const createPublicLead = (leadData)=>{
    return api.post("/lead/public/create-lead",leadData)
}

//create private lead
export const createPrivateLead = (leadData)=>{
    return api.post("/lead/create-lead",leadData)
}

//Fetch all leads
export const getAllLeads = (params)=>{
    return api.get("/lead",{params})
}

//Fetch lead by id
export const getLeadById = (id)=>{
    return api.get(`/lead/${id}`)
}

//Update lead
export const updateLead= (id,leadData)=>{
    return api.patch(`/lead/${id}`,leadData)
} 

export const deleteLead =(id)=>{
    return api.delete(`/lead/${id}/delete`)
}