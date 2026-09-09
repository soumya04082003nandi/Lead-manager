const leadModel = require("../models/leadModel");
const userModel= require("../models/userModel")
const activityModel = require("../models/activityModel")

//controller to create lead by loggedin user
const handlePrivateLeadCreation = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            source,
            assignedTo
        } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const newLead = await leadModel.create({
            name: name.trim(),
            email: normalizedEmail,
            phone,
            company,
            source,
            assignedTo: assignedTo || null,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Lead created successfully.",
            lead: {
                id: newLead._id,
                name: newLead.name,
                email: newLead.email,
                phone: newLead.phone,
                company: newLead.company,
                source: newLead.source,
                status: newLead.status,
                assignedTo: newLead.assignedTo,
                createdBy: newLead.createdBy
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

//controller to create lead by public through website
const handlePublicLeadCreation = async (req,res) => {
    try{
        const { name, email, phone, company} = req.body;

        if(!name || !email){
            return res.status(400).json({
                success: false,
                message: "Name and email are required."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const newLead = await leadModel.create ({
            name:name.trim(),
            email:normalizedEmail,
            phone,
            company,
            source: "website",
            status : "new",
            createdBy: null,
            assignedTo: null
        });

        return res.status(201).json({
            success:true,
            message:"Thank you! Your information has been submitted.",
            lead:{
                 id: newLead._id,
                name: newLead.name,
                email: newLead.email,
                phone: newLead.phone,
                company: newLead.company,
                source: newLead.source,
                status: newLead.status,
                assignedTo: newLead.assignedTo,
                createdBy: newLead.createdBy
            }
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message:" Internal server error."
        })
    }
}

//controller to fetch all leads including filters
const handleGetLeads = async (req, res) =>{
    try {
        const {page =1,limit=10,status,assignedTo,search}=req.query;

        const pageNumber = Number(page);
        const limitNumber= Number(limit);

        const filter = {};

        //status filter
        if (status) {
            filter.status=status;
        }

        //assignTo filter
        if (assignedTo) {
            filter.assignedTo=assignedTo;
        }

        //search filter
        if (search) {
            filter.$or=[
                {
                    name:{
                        $regex:search,
                        $options: "i"
                    }
                },
                {
                    email:{
                        $regex:search,
                        $options: "i"
                    }

                },
                 {
                    company:{
                        $regex:search,
                        $options: "i"
                    }

                },
            ]
        }

        const skip = (pageNumber-1)* limitNumber;

        const [leads,totalLeads]= await Promise.all([
            leadModel
            .find(filter)
            .populate("assignedTo","name email role")
            .populate("createdBy","name email role")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limitNumber),

            leadModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalLeads/limitNumber);

        return res.status(200).json({
            success:true,
            message:"Leads fatched successfully.",
            pagination:{
                currentPage:pageNumber,
                limit:limitNumber,
                totalLeads,
                totalPages
            },
            leads
        });
        
    } catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message:" Internal server error."
        })
    }
}

//controller to fetch lead by id
const handleLeadById = async (req, res)=>{
    try {
        const {id}=req.params;
        const lead = await leadModel
        .findById(id)
        .populate("assignedTo","name email role")
        .populate("createdBy", "name email role")

        if(!lead){
            return res.status(404).json({
                success:false,
                message:"Lead not found."
            });
        }

        return res.status(200).json({
            success:true,
            message:"Lead featched successfully.",
            lead
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
    }
}

//controller to update leads
const handleUpdateLeads = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            company,
            source,
            status,
            assignedTo
        } = req.body;

        // Check if at least one field is provided
        if (
            name === undefined &&
            email === undefined &&
            phone === undefined &&
            company === undefined &&
            source === undefined &&
            status === undefined &&
            assignedTo === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update."
            });
        }

        // Find lead
        const lead = await leadModel.findById(id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found."
            });
        }
        
        //for activity creation
        const oldStatus = lead.status;
        const oldAssignedTo = lead.assignedTo;

        // Update normal fields
        if (name !== undefined) {
            lead.name = name.trim();
        }

        if (email !== undefined) {
            lead.email = email.toLowerCase().trim();
        }

        if (phone !== undefined) {
            lead.phone = phone;
        }

        if (company !== undefined) {
            lead.company = company;
        }

        if (source !== undefined) {
            lead.source = source;
        }

        if (status !== undefined) {
            lead.status = status;
        }

        // Assignment permission
        if (assignedTo !== undefined) {

            // Only admin can assign leads
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admin can assign leads."
                });
            }

            // Check whether the user exists
            const assignedUser = await userModel.findById(assignedTo);

            if(!assignedUser){
                return res.status(404).json({
                    success:false,
                    message: "Assigned user not found."
                });
            }
            // Lead can only be assigned to a member
            if(assignedUser.role !== "member"){
                return res.status(400).json({
                    success:false,
                    message: "Lead can only be assigned to a member."
                });
            }
            lead.assignedTo = assignedUser._id;
        }

        const updatedLead = await lead.save();

        //create activity
        if(status !== undefined && oldStatus !==status){
            await activityModel.create({
                lead: lead._id,
                user: req.user.id,
                action:"Status_shanged",
                description: `Lead status changed from ${oldStatus} to ${status}`
            })
        }

        if (
            assignedTo !== undefined && String(oldAssignedTo) !== String(updatedLead.assignedTo)) 
            {
            await activityModel.create({
                lead: updatedLead._id,
                user: req.user.id,
                action: "assigned",
                description: "Lead assigned to a member"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully.",
            lead: {
                id: updatedLead._id,
                name: updatedLead.name,
                email: updatedLead.email,
                company: updatedLead.company,
                phone: updatedLead.phone,
                source: updatedLead.source,
                status: updatedLead.status,
                assignedTo: updatedLead.assignedTo,
                createdBy: updatedLead.createdBy,
                createdAt: updatedLead.createdAt,
                updatedAt: updatedLead.updatedAt
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

//contrller to delete leads
const handleDeleteLead = async (req, res) =>{
    try {

        const {id} = req.params;

        const lead = await leadModel.findById(id);

        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found."
            });
        }

           // Create activity before deleting the lead
        await activityModel.create({
            lead: lead._id,
            user: req.user.id,
            action: "deleted",
            description: "Lead deleted"
        });

        await leadModel.findByIdAndDelete(id)

        return res.status(200).json({
            success:true,
            message:"Lead deleted successfully."
        })
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error."
        })
        
    }
}

module.exports = {
    handlePrivateLeadCreation,
    handlePublicLeadCreation,
    handleGetLeads,
    handleLeadById,
    handleUpdateLeads,
    handleDeleteLead
    
};