const mongoose= require("mongoose")

const noteSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Types.ObjectId,
            ref: "User",
            required:true
        },
        lead:{
            type: mongoose.Types.ObjectId,
            ref: "leadModel",
            required:true
        },
        content:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("Notes",noteSchema)