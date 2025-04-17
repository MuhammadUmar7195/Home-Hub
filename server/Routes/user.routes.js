const express = require("express");
const router = express.Router();
const { test } = require('../Controller/user.controller');

router.get("/test", test)

module.exports = router;