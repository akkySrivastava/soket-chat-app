const express = require("express");
const router = express.Router();
const chatRouter = require("./Chat");

router.use("/chat", chatRouter);

module.exports = router;
