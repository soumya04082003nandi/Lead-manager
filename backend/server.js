const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./src/config/db")
const authRouter = require("./src/routes/auth.routes")
const leadRouter = require("./src/routes/lead.routes")



dotenv.config();

//database connection
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/lead",leadRouter)

app.get("/", (req, res) => {
    res.send("API is running");
});


app.listen(PORT, () => {
    console.log("Server is running on ", PORT);

});