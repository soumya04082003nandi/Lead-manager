const userModel = require("../models/userModel");

const handleGetUsers = async (req,res)=>{
    try {
        const users = await userModel.find(
            {role:"member"},
            "name email role"
        )

        return res.status(200).json({
            success:true,
            message:"Users list fetched successfully.",
            users,
        })
    } catch (err) {
        console.error("GET USERS ERROR", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users.",
        });
    }
}

module.exports={
    handleGetUsers,
}