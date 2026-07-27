const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")




const handleRegister = async (req, res) => {

    try {
        const { name, email, password} = req.body;

        //validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        //email normalization
        const normalizedEmail = email.toLowerCase().trim();

        //existing user validation
        const existingUser = await userModel.findOne({ email:normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Please log in."
            })
        };

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        //user creation
        const newUser = await userModel.create({
            name,
            email:normalizedEmail,
            password: hashedPassword,
            role:"member"
        });

        //token creation
        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
                email: newUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        //token saving
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        //response
        return res.status(201).json({  
            success: true,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error"
        });
    };

};


module.exports = {
    handleRegister
}