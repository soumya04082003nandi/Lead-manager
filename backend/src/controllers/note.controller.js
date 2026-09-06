const noteModel = require("../models/noteModel")
const leadModel= require("../models/leadModel")

const handleCreateNote = async (req, res)=>{
    try {
        const {id} = req.params;
        const {content} = req.body;

        //check note content
        if(!content || !content.trim()){
            return res.status(400).json({
                success:false,
                message:"Note content is required."
            })
        }

        //check whether the lead exists
        const lead = await leadModel.findById(id);
        
        if(!lead){
             return res.status(404).json({
                success:false,
                message:"Lead not found."
            })
        }

        // create note
        const note = await noteModel.create({
            lead:lead._id,
            user:req.user.id,
            content:content.trim()
        }) ;

        return res.status(201).json({
            success:true,
            message:"Note added successfully.",
            note:{
                id:note._id,
                lead:note.lead,
                user:note.user,
                content: note.content,
                createdAt:note.createdAt,
                updatedAt: note.updatedAt
            }
        })


        
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
    }
}



module.exports={
    handleCreateNote
}