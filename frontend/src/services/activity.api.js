import api from "./api";

// Get activities for a lead
export const getLeadActivities = (id) => {
    return api.get(`/lead/${id}/activities`);
};