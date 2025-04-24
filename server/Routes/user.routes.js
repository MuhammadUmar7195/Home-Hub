const express = require("express");
const router = express.Router();
const { test, updateUser, deleteUser, getUserListing } = require('../Controller/user.controller');
const verifyToken = require("../Utils/verifyUser");

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listing/:id", verifyToken, getUserListing);

module.exports = router;