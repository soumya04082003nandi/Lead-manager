const express = require("express");
const leadRouter = express.Router();

const leadController = require("../controllers/leadController");
const { isLoggedIn } = require("../middleware/auth");
const {checkRole} = require("../middleware/role")


/**
 * @route POST /api/leads
 * @description Create a new lead
 * @access Private - Admin & Member
 */
leadRouter.post(
    "/create-lead",
    isLoggedIn,checkRole("admin","member"),
    leadController.handlePrivateLeadCreation
);

/**
 * @route POST /api/leads
 * @description Create a new lead
 * @access Private - Admin & Member
 */
leadRouter.post(
    "/public/create-lead",
    leadController.handlePublicLeadCreation
);

/**
 * @route GET /api/lead
 * @description Get all leads with pagination and filtering
 * @access Private
 */
leadRouter.get(
    "/",
    isLoggedIn,
    leadController.handleGetLeads
);


module.exports = leadRouter;