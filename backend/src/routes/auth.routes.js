const express = require("express");
const authRouter= express.Router();
const authController= require("../controllers/auth.controller");
const {isLoggedIn} = require("../middleware/auth");


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.handleRegister);



/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */

authRouter.post("/login", authController.handleLogin);


/**
 * @route POST /api/auth/logout
 * @description Logout a user
 * @access Private
 */
authRouter.get("/logout",isLoggedIn, authController.handleLogout);

/**
 * @route GET /api/auth/me
 * @description Get current user details
 * @access Private
 */
authRouter.get("/me",isLoggedIn, authController.handleGetMe);



module.exports= authRouter;
