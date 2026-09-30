import { useEffect, useState } from "react";
import { getAllLeads } from "../services/lead.api";

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllLeads();

            console.log("LEADS RESPONSE:", response.data);

            setLeads(response.data.leads);
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
    }, []);

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
        </div>
    );
};

export default Leads;