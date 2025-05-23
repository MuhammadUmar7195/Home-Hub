const express = require("express");
const app = express();
const connectDB = require("./Config/connect");
const status = require("express-status-monitor");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const cors = require("cors");
const path = require("path");

//third-party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(status());

app.use(express.static(path.join(__dirname, "dist")));

//add cors for accessing ports
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
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
const listingRoute = require("./Routes/listing.route");
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

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