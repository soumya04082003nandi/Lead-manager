import { useEffect, useState } from "react";
import { getAllLeads } from "../services/lead.api";

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalLeads: 0,
        totalPages: 0
    })

    //For filtering the leads
    const [status, setStatus]= useState("")
    const [source, setSource] = useState("")

    const fetchLeads = async (page=1) => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllLeads({
                page,
                limit:10,
                status,
                source,
            });

            console.log("LEADS RESPONSE:", response.data);

            setLeads(response.data.leads);
            setPagination(response.data.pagination)
        } catch (error) {
            console.log("LEADS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch leads."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [status, source]);

    if (loading) {
        return <h1>Loading leads...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <h1>Leads</h1>

            <p>Total Leads: {leads.length}</p>

            <div>
                
            </div>

            <div>

                <label htmlFor="source">Filter by Source</label>

                <select  
                id="source"
                value={source}
                onChange={(e)=>setSource(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social_media">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>

                </select>  
                <label htmlFor="status">
                    Filter by Status:
                </label>

                //filter by status
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id}>
                            <td>{lead.name}</td>

                            <td>{lead.email}</td>

                            <td>{lead.phone || "-"}</td>

                            <td>{lead.company || "-"}</td>

                            <td>{lead.source}</td>

                            <td>{lead.status}</td>

                            <td>
                                {lead.assignedTo?.name || "Unassigned"}
                            </td>

                            <td>
                                <button>
                                    View
                                </button>

                                <button>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    onClick={() => fetchLeads(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>

                <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                    onClick={() => fetchLeads(pagination.currentPage + 1)}
                    disabled={
                        pagination.currentPage === pagination.totalPages
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Leads;