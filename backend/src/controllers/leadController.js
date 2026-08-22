const leadModel = require("../models/leadModel");

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

module.exports = {
    handlePrivateLeadCreation,
    handlePublicLeadCreation,
    handleGetLeads
};