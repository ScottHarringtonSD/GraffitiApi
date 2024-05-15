const { json } = require("express");
const Credentials = require("../Models/Credentials");
const asyncHandler = require("express-async-handler");
const Token = require("../Models/Token");

//takes user credentials and returns a token if they match
//route = /login POST

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in required fields" });
  }

  const loginDetails = await Credentials.findOne({ username }).lean().exec();

  if (loginDetails === null || loginDetails.password !== req.body.password) {
    return res
      .status(401)
      .json({ message: "Incorrect login details provided" });
  }

  const token = await Token.findOne();

  if (loginDetails) {
    return res.status(201).json(token);
  }

  res.status(400).json({ message: "Invalid data received" });
});
