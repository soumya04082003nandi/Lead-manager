import { useEffect, useState } from "react";
import { getAllLeads } from "../services/lead.api";
import { getUsers } from "../services/user.api";
import LeadTable from "../components/LeadTable";

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalLeads: 0,
        totalPages: 0
    })

    //For filtering the leads
    const [status, setStatus]= useState("")
    const [source, setSource] = useState("")
    const [assignedTo, setAssignedTo] = useState("")
    const [search, setSearch] = useState("")

    const fetchUsers = async ()=>{
        try {
            const response = await getUsers();

            setUsers(response.data.users);
        } catch (err) {
            console.log("USERS ERROR". err)
        }
    }

    useEffect(()=>{
        fetchUsers();
    },[]);

    const fetchLeads = async (page=1) => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllLeads({
                page,
                limit:10,
                status,
                source,
                assignedTo,
                search,
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
    }, [status, source, assignedTo, search]);

    // if (loading) {
    //     return <h1>Loading leads...</h1>;
    // }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <h1>Leads</h1>

            <p>Total Leads: {leads.length}</p>

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

                //filter by assignTo

                <label htmlFor="assignedTo">
                    Filter by Assigned To:
                </label>

                <select
                    id="assignedTo"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                >
                    <option value="">All</option>

                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>

                //filter by search
                <label htmlFor="search">
                    Search Leads:
                </label>

                <input
                    id="search"
                    type="text"
                    placeholder="Search by name, email, phone or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <LeadTable leads={leads}/>

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