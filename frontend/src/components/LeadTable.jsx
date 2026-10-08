

const LeadTable =({leads})=>{

    return(
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {leads.map((lead)=>(
                    <tr key={lead._id} >
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone || "-"}</td>
                        <td>{lead.company || "-"}</td>
                        <td>{lead.source}</td>
                        <td>{lead.status}</td>
                        <td>{lead.assignedTo || "Unassigned"}</td>

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
    )

}

export default LeadTable