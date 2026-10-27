import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getLeadById } from "../services/lead.api";
import { getLeadActivities } from "../services/activity.api";
import { createNote, getLeadNotes } from "../services/note.api";

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Lead details
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Activities
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState("");

    // Notes
    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteSubmitting, setNoteSubmitting] = useState(false);
    const [noteMessage, setNoteMessage] = useState("");

    // Fetch lead details
    const fetchLead = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getLeadById(id);
            setLead(response.data.lead);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to fetch lead details."
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch activities
    const fetchActivities = async () => {
        try {
            setActivityLoading(true);
            setActivityError("");

            const response = await getLeadActivities(id);
            setActivities(response.data.activities || []);
        } catch (err) {
            setActivityError(
                err.response?.data?.message ||
                    "Failed to fetch activity history."
            );
        } finally {
            setActivityLoading(false);
        }
    };

    // Fetch notes
    const fetchNotes = async () => {
        try {
            setNotesLoading(true);
            setNotesError("");

            const response = await getLeadNotes(id);
            setNotes(response.data.notes || []);
        } catch (err) {
            setNotesError(
                err.response?.data?.message ||
                    "Failed to fetch notes."
            );
        } finally {
            setNotesLoading(false);
        }
    };

    // Load lead, activities, and notes
    useEffect(() => {
        fetchLead();
        fetchActivities();
        fetchNotes();
    }, [id]);

    // Create a note
    const handleAddNote = async (e) => {
        e.preventDefault();

        const content = noteContent.trim();

        if (!content) {
            setNoteMessage("Please enter a note before submitting.");
            return;
        }

        try {
            setNoteSubmitting(true);
            setNoteMessage("");

            await createNote(id, { content });

            setNoteContent("");
            setNoteMessage("Note added successfully.");

            // Refresh notes and activities
            await Promise.all([
                fetchNotes(),
                fetchActivities(),
            ]);
        } catch (err) {
            setNoteMessage(
                err.response?.data?.message ||
                    "Failed to add note."
            );
        } finally {
            setNoteSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading Lead Details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!lead) {
        return <p>Lead not found.</p>;
    }

    return (
        <div>
            <button onClick={() => navigate("/leads")}>
                Back to Leads
            </button>

            <h1>{lead.name}</h1>

            {/* Lead Details */}
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

            {/* Notes Section */}
            <section>
                <h2>Notes</h2>

                <form onSubmit={handleAddNote}>
                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Write a note about this lead..."
                        rows={4}
                        required
                        disabled={noteSubmitting}
                        style={{
                            display: "block",
                            width: "100%",
                            maxWidth: "600px",
                            marginBottom: "10px",
                            padding: "10px",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={noteSubmitting || !noteContent.trim()}
                    >
                        {noteSubmitting ? "Adding Note..." : "Add Note"}
                    </button>
                </form>

                {noteMessage && <p>{noteMessage}</p>}

                {notesLoading && <p>Loading notes...</p>}

                {notesError && (
                    <p role="alert">{notesError}</p>
                )}

                {!notesLoading &&
                    !notesError &&
                    notes.length === 0 && (
                        <p>No notes added yet.</p>
                    )}

                {!notesLoading &&
                    !notesError &&
                    notes.length > 0 && (
                        <div>
                            {notes.map((note) => (
                                <article
                                    key={note._id}
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "12px",
                                        marginTop: "12px",
                                        maxWidth: "600px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <p>{note.content}</p>

                                    <small>
                                        By: {note.user?.name || "Unknown user"}
                                    </small>

                                    <br />

                                    <small>
                                        {note.createdAt
                                            ? new Date(
                                                  note.createdAt
                                              ).toLocaleString()
                                            : "-"}
                                    </small>
                                </article>
                            ))}
                        </div>
                    )}
            </section>

            <hr />

            {/* Activity Trail */}
            <section>
                <h2>Activity Trail</h2>

                {activityLoading && (
                    <p>Loading activity history...</p>
                )}

                {activityError && (
                    <p role="alert">{activityError}</p>
                )}

                {!activityLoading &&
                    !activityError &&
                    activities.length === 0 && (
                        <p>No activity recorded for this lead yet.</p>
                    )}

                {!activityLoading &&
                    !activityError &&
                    activities.length > 0 && (
                        <div>
                            {activities.map((activity) => (
                                <article
                                    key={activity._id}
                                    style={{ marginBottom: "20px" }}
                                >
                                    <h3>{activity.action}</h3>

                                    <p>{activity.description}</p>

                                    <p>
                                        By:{" "}
                                        {activity.user?.name || "Unknown user"}
                                    </p>

                                    <small>
                                        {activity.createdAt
                                            ? new Date(
                                                  activity.createdAt
                                              ).toLocaleString()
                                            : "-"}
                                    </small>
                                </article>
                            ))}
                        </div>
                    )}
            </section>
        </div>
    );
};

export default LeadDetails;