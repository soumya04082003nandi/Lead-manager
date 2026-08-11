const leadModel= require("../models/leadModel")

const handleLeadCreation = (req,res)=>{
    try {
        const {name, email, phone, company, source, status, assignTo, createdBy} = req.body

        if(!name || !email ){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }else{
            
        }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong."
        })
    }
}