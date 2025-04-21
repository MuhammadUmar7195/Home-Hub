const express = require("express");
const router = express.Router();
const { test, updateUser } = require('../Controller/user.controller');
const verifyToken  = require("../Utils/verifyUser");

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser)

module.exports = router;