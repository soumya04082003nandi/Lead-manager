const express= require("express")
const activityRouter= express.Router();
const {isLoggedIn}= require("../middleware/auth")
const activityController= require("../controllers/activity.controller")


activityRouter.get(
    "/:id/activities",
    isLoggedIn,
    activityController.handleGetLeadActivities
)


module.exports= activityRouter