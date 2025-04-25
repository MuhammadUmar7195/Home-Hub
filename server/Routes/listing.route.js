const express = require("express");
const router = express.Router();
const {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings } = require("../Controller/listing.controller");
const verifyToken = require("../Utils/verifyUser");

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

module.exports = router;