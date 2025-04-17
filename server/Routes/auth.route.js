const express = require("express");
const router = express.Router();
const { singup } = require("../Controller/auth.controller");

router.post("/signup", singup)

module.exports = router;