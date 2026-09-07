const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    lead:{
        type: mongoose.Types.ObjectId,
        ref: "leadModel",
        required:true
    },

    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    action:{
        enum:[
            "created",
            "updated",
            "status_changed",
            "assigned",
            "note_added",
            "deleted"
        ],
        required:true
    },
    description:{
        type:String,
        required:true
    }
},
{
    timestamps:true
}
);


module.exports= mongoose.model("Activite",activitySchema);