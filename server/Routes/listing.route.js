const express = require("express");
const router = express.Router();
const { createListing, deleteListing } = require("../Controller/listing.controller");
const verifyToken = require("../Utils/verifyUser");

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);

module.exports = router;