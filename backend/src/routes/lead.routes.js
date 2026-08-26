const express = require("express");
const leadRouter = express.Router();

const leadController = require("../controllers/leadController");
const { isLoggedIn } = require("../middleware/auth");
const {checkRole} = require("../middleware/role");
const { check } = require("express-validator");


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
    isLoggedIn,checkRole("admin","member"),
    leadController.handleGetLeads
);

/**
 * @route GET /api/lead/:id
 * @description Get lead by id
 * @access Private
 */
leadRouter.get(
    "/:id",
    isLoggedIn,
    checkRole("admin","member"),
    leadController.handleLeadById
)

/**
 * @route PATCH /api/lead/:id
 * @description Update leads by id
 * @access Private
 */
leadRouter.patch(
    "/:id",
    isLoggedIn,
    checkRole("admin","member"),
    leadController.handleUpdateLeads
)






module.exports = leadRouter;