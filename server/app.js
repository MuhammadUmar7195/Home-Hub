const express = require("express");
const app = express();
const connectDB = require("./Config/connect");
require("dotenv").config();

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


//test route
app.get("/", (req, res) => {
    res.send(`<center>Server is running on ${port}</center>`);
});