const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const app = require("./app");

dotenv.config();

// database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});