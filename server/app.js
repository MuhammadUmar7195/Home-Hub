const express = require("express");
const app = express();
const connectDB = require("./Config/connect");
const status = require("express-status-monitor");
require("dotenv").config();
const cors = require("cors");

//third-party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(status());

//add cors for accessing ports
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true 
}));

//environment variables
const port = process.env.PORT;
const dataBase = process.env.DB_URL;

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        await connectDB(dataBase);
    } catch (error) {
        console.log("Error in server ", error);
    }
}

//server & DB connection
start();


//user routes
const userRoute = require("./Routes/user.routes");
const authRoute = require("./Routes/auth.route");
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

//middlware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        msg: message
    })
});

//test route
app.get("/", (req, res) => {
    // res.json({success: true, msg: "Hello Server"})
    res.send(`<center>Server is running on ${port}</center>`);
});