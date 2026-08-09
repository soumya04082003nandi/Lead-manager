const mongoose = require('mongoose');


const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    phone: {
        type: String,
        trim: true
    },

    company: {
        type: String,
        trim: true,
    },

    source: {
        type: String,
        enum: [
            "website",
            "referral",
            "social_media",
            "advertisement",
            "other"
        ],
        default: "website"
    },
    status: {
        type: String,
        enum: [
            "new",
            "contacted",
            "qualified",
            "proposal",
            "won",
            "lost"
        ],
        default: "new"
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
},
    {
        timestamps: true
    }

)

const leadModel = mongoose.model("leadModel", leadSchema);

module.exports= leadModel;