import { useEffect,useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeadById } from "../services/lead.api"

const LeadDetails = ()=>{
    const {id} = useParams();

    const [lead, setLeads] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const fetchLead = async ()=>{
        try {
            setLoading(true);
            setError("")

            const response = await getLeadById(id);

            setLeads(response.data.lead);
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

    return(
        <div>
            <button onClick={() => navigate("/leads:id")}>
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
