const express = require("express");
const leadRouter = express.Router();

const leadController = require("../controllers/leadController");
const { isLoggedIn } = require("../middleware/auth");
const checkRole = require("../middleware/role");

/**
 * @route POST /api/leads
 * @description Create a new lead
 * @access Private - Admin & Member
 */
leadRouter.post(
    "/create-lead",
  
    leadController.handleLeadCreation
);

module.exports = leadRouter;