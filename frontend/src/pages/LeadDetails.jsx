import { useEffect,useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeadById } from "../services/lead.api"
import { getLeadActivities } from "../services/activity.api"


const LeadDetails = ()=>{
    const {id} = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    //for activities
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState("")


    //fetch leads
    const fetchLead = async ()=>{
        try {
            setLoading(true);
            setError("")

            const response = await getLeadById(id);
            // console.log(response.data, "from leadDetails");
            
            setLead(response.data.lead);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch lead details."
            )
        }finally{
            setLoading(false)
        }
    }

    //fetch activities
    const fetchActivities = async ()=>{
        try {
            setActivityLoading(true);
            setActivityError("");

            const response= await getLeadActivities(id);

            // console.log("Activity API Response:", response.data);
            
            setActivities(response.data.activities || []);
            
        } catch (err) {
            setActivityError(
                err.response?.data?.message ||
            "Failed to fetch activity history."
            );
        }finally{
            setActivityLoading(false)
        };
    }

    useEffect(()=>{
        fetchLead();
        fetchActivities();
    },[id])

    if(loading){
        return(
            <p> Loading Lead Details...</p>
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

            <hr />

            <h2>Activity Trail</h2>

            {activityLoading && <p>Loading activity history...</p>}

            {activityError && <p>{activityError}</p>}

            {!activityLoading && !activityError && activities.length === 0 && (
                <p>No activity recorded for this lead yet.</p>
            )}

            {!activityLoading && !activityError && activities.length > 0 && (
                <div>
                    {activities.map((activity) => (
                        <div key={activity._id} style={{ marginBottom: "20px" }}>
                            <h3>{activity.action}</h3>

                            <p>{activity.description}</p>

                            <p>
                                By: {activity.user?.name || "Unknown user"}
                            </p>

                            <small>
                                {activity.createdAt
                                    ? new Date(activity.createdAt).toLocaleString()
                                    : "-"}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LeadDetails
