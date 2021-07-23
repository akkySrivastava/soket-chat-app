const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Chat = require("../model/chatDB");

router.post("/", async (req, res) => {
  Chat.create(
    {
      userId: req.body.userId,
      text: req.body.text,
      name: req.body.name,
    },
    (err, chat) => {
      if (err) {
        res.status(400).send("Bad Request");
      } else {
        res.status(201).send(chat);
      }
    }
  );
});

module.exports = router;
