const express = require("express");
const router = express.Router();
const { createListing } = require("../Controller/listing.controller");
const verifyToken = require("../Utils/verifyUser");

router.post("/create", verifyToken, createListing);

module.exports = router;