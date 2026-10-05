const express= require("express")
const userRouter= express.Router();

const {isLoggedIn}= require("../middleware/auth")
const userController= require("../controllers/user.controller");

userRouter.get("/",isLoggedIn,userController.handleGetUsers)


module.exports=userController