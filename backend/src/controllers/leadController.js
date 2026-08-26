const leadModel = require("../models/leadModel");

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
const handleUpdateLeads= async (req,res)=>{
    try {
        const {id}=req.params;

           const {
            name,
            email,
            phone,
            company,
            source,
            status,
            assignedTo
        } = req.body;

        if (name === undefined &&
            email === undefined &&
            phone === undefined &&
            company === undefined &&
            source === undefined &&
            status === undefined &&
            assignedTo === undefined) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update."

            })
        }

        const lead = await leadModel.findById(id);

        if(!lead){
            return res.status(404).json({
                success:false,
                message:"Lead not found."
            })
        }

        if (name !== undefined){
            lead.name=name.trim();
        }

        if(email !== undefined){
            lead.email=email.toLowerCase().trim();
        }

        if(phone !== undefined){
            lead.phone = phone;
        }

        if (company !==undefined) {
            lead.company=company;
        }

        if (source !==undefined) {
            lead.source=source;
        }

        if (status !== undefined) {
            lead.status= status;
        }

        if(assignedTo !== undefined){
            lead.assignedTo=assignedTo;
        }

        const updatedLead= await lead.save();

        return res.status(200).json({
            success:true,
            message:"Lead updated successfully.",
            lead :{
                id:updatedLead._id,
                name:updatedLead.name,
                email:updatedLead.email,
                company:updatedLead.company,
                phone:updatedLead.phone,
                source:updatedLead.source,
                status:updatedLead.status,
                assignedTo:updatedLead.assignedTo,
                createdBy:updatedLead.createdBy,
                createdAt:updatedLead.createdAt,
                updatedAt:updatedLead.updatedAt
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
    }
}

module.exports = {
    handlePrivateLeadCreation,
    handlePublicLeadCreation,
    handleGetLeads,
    handleLeadById,
    handleUpdateLeads
    
};