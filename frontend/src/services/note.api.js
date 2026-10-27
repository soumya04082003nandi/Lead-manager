import api from "./api";

// Create a note for a lead
export const createNote = (id, noteData) => {
    return api.post(`/lead/${id}/create-notes`, noteData);
};

export const getLeadNotes = (id) =>{
    return api.get(`/lead/${id}/notes`);
}