import { useEffect,useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeadById } from "../services/lead.api"

const LeadDetails = ()=>{
    const {id} = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const fetchLead = async ()=>{
        try {
            setLoading(true);
            setError("")

            const response = await getLeadById(id);
            console.log(response, "from leadDetails");
            
            setLead(response.data.lead);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch lead details."
            )
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchLead();
    },[id])

    if(loading){
        return(
            <p> Loading lead details...</p>
        )
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!lead) {
        return <p>Lead not found.</p>;
    }
    return(
        <div>
            <button onClick={() => navigate("/leads")}>
                Back to Leads
            </button>

            <h1>{lead.name}</h1>

            <h2>Contact Information</h2>

            <p>Email: {lead.email}</p>
            <p>Phone: {lead.phone || "-"}</p>
            <p>Company: {lead.company || "-"}</p>

            <h2>Lead Information</h2>

            <p>Source: {lead.source}</p>
            <p>Status: {lead.status}</p>

            <p>
                Assigned To: {lead.assignedTo?.name || "Unassigned"}
            </p>

            <p>
                Created By: {lead.createdBy?.name || "-"}
            </p>

            <p>
                Created At:{" "}
                {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : "-"}
            </p>

            <p>
                Last Updated:{" "}
                {lead.updatedAt
                    ? new Date(lead.updatedAt).toLocaleString()
                    : "-"}
            </p>
        </div>
    )
}

export default LeadDetails
