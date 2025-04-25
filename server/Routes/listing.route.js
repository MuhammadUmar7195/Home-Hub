const express = require("express");
const router = express.Router();
const { createListing, deleteListing, updateListing } = require("../Controller/listing.controller");
const verifyToken = require("../Utils/verifyUser");

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);

module.exports = router;