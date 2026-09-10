const activityModel= require("../models/activityModel")


const handleGetLeadActivities = async (req,res)=>{
    try {

        const {id}= req.params;

        const activites= await activityModel
        .find({lead:id})
        .populate("user","name email role")
        .sort({createdAt: -1});

        return res.status(200).json({
            success:true,
            count:activites.length,
            activites
        })
        
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"Internal server error."
        })
    }
}


module.exports={
    handleGetLeadActivities
}