const express= require("express");
const leadRouter =express.Router();
const leadController = require("../controllers/leadController");
const {isLoggedIn} = require("../middleware/auth")

/**
 * @Route POST api/lead/create-lead
 * @description create a new lead
 * @access public
 */
leadRouter.post("/create-lead",leadController.handleLeadCreation);


module.exports= leadRouter;
