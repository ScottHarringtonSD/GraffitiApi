const { json, query } = require("express");
const Graffiti = require("../Models/Graffiti");
const asyncHandler = require("express-async-handler");
const TokenAuth = require("../HelperClasses/TokenAuth");

// Get all graffiti
// route = /graffitis GET
const getAllGraffiti = asyncHandler(async (req, res) => {
  const jwt = require("njwt");
  let token = "";
  var tokenCheck = false;

  for (let i = 0; i < req.rawHeaders.length; i++) {
    if (req.rawHeaders[i] === "Auth") {
      quotesToken = req.rawHeaders[i + 1];
      token = quotesToken.replace(/^["'](.+(?=["']$))["']$/, "$1");
    }
  }
  await jwt.verify(token, "graf-token-secret", (err, verifiedJwt) => {
    if (err) {
      console.log("failed at token check");
    } else {
      tokenCheck = true;
    }
  });

  if (!tokenCheck) {
    return res.status(401).json({ message: "Token authentication failed" });
  }

  const queryString = require("node:querystring");
  const q = queryString.parse();
  var search = req.query.search;

  if (search) {
    var re = new RegExp(search, "gi");
    const graffitis = await Graffiti.find({
      $or: [
        {
          name: { $regex: re },
        },
        {
          graffitiSurveyNumber: { $regex: re },
        },
        {
          address: { $regex: re },
        },
        {
          description: { $regex: re },
        },
      ],
    })
      .lean()
      .exec();

    return res.json(graffitis);
  }

  if (search === "") {
    return res.json(new Array());
  }

  const graffitis = await Graffiti.find().lean().exec();
  if (!graffitis?.length)
    return res.status(400).json({ message: "No graffiti found" });

  res.json(graffitis);
});

// Create new Graffiti
// route = /graffitis POST
const createNewGraffiti = asyncHandler(async (req, res) => {
  const jwt = require("njwt");
  let token = "";
  var tokenCheck = false;

  for (let i = 0; i < req.rawHeaders.length; i++) {
    if (req.rawHeaders[i] === "Auth") {
      quotesToken = req.rawHeaders[i + 1];
      token = quotesToken.replace(/^["'](.+(?=["']$))["']$/, "$1");
    }
  }
  await jwt.verify(token, "graf-token-secret", (err, verifiedJwt) => {
    if (err) {
      console.log("failed at token check");
    } else {
      tokenCheck = true;
    }
  });

  if (!tokenCheck) {
    return res.status(401).json({ message: "Token authentication failed" });
  }
  const {
    graffitiSurveyNumber,
    name,
    size,
    address,
    description,
    postcode,
    location,
    imgLocation,
  } = req.body;
  if (
    !graffitiSurveyNumber ||
    !name ||
    !size ||
    !address ||
    !description ||
    !postcode ||
    !location
  )
    return res.status(400).json({ message: "Please fill in required fields" });

  const duplicate = await Graffiti.findOne({ graffitiSurveyNumber })
    .lean()
    .exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "Duplicate graffiti survey number" });

  // create and store the new graffiti
  const graffiti = await Graffiti.create({
    graffitiSurveyNumber,
    name,
    size,
    address,
    description,
    postcode,
    location,
    imgLocation,
  });

  if (graffiti) return res.status(201).json({ message: "New entry created" });

  res.status(400).json({ message: "Invalid data received" });
});

// @desc Update graffiti
// @route PATCH /graffitis
const updateGraffiti = asyncHandler(async (req, res) => {
  const jwt = require("njwt");
  let token = "";
  var tokenCheck = false;

  for (let i = 0; i < req.rawHeaders.length; i++) {
    if (req.rawHeaders[i] === "Auth") {
      quotesToken = req.rawHeaders[i + 1];
      token = quotesToken.replace(/^["'](.+(?=["']$))["']$/, "$1");
    }
  }
  await jwt.verify(token, "graf-token-secret", (err, verifiedJwt) => {
    if (err) {
      console.log("failed at token check");
    } else {
      tokenCheck = true;
    }
  });

  if (!tokenCheck) {
    return res.status(401).json({ message: "Token authentication failed" });
  }
  const {
    _id,
    graffitiSurveyNumber,
    name,
    size,
    address,
    description,
    postcode,
    location,
    imgLocation,
  } = req.body;

  // Confirm data
  if (
    !graffitiSurveyNumber ||
    !name ||
    !size ||
    !address ||
    !description ||
    !postcode ||
    !location
  )
    return res.status(400).json({ message: "Please fill in required fields" });

  const graffiti = await Graffiti.findById(_id).exec();
  if (!graffiti) return res.status(400).json({ message: "Graffiti not found" });

  const duplicate = await Graffiti.findOne({ graffitiSurveyNumber })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== _id) {
    return res
      .status(409)
      .json({ message: "Duplicate graffiti survey numbers" });
  }

  graffiti.graffitiSurveyNumber = graffitiSurveyNumber;
  graffiti.name = name;
  graffiti.size = size;
  graffiti.address = address;
  graffiti.description = description;
  graffiti.postcode = postcode;
  graffiti.location = location;
  graffiti.imgLocation = imgLocation;

  const updatedGraffiti = await graffiti.save();
  res.json(updatedGraffiti);
});

// @desc Delete graffiti
// @route Delete /graffitis
const deleteGraffiti = asyncHandler(async (req, res) => {
  const jwt = require("njwt");
  let token = "";
  var tokenCheck = false;

  for (let i = 0; i < req.rawHeaders.length; i++) {
    if (req.rawHeaders[i] === "Auth") {
      quotesToken = req.rawHeaders[i + 1];
      token = quotesToken.replace(/^["'](.+(?=["']$))["']$/, "$1");
    }
  }
  await jwt.verify(token, "graf-token-secret", (err, verifiedJwt) => {
    if (err) {
      console.log("failed at token check");
    } else {
      tokenCheck = true;
    }
  });

  if (!tokenCheck) {
    return res.status(401).json({ message: "Token authentication failed" });
  }

  const { _id } = req.body;

  if (!_id) return res.status(400).json({ message: "Graffiti id required" });

  const graffiti = await Graffiti.findById(_id).exec();
  if (!graffiti)
    return res.status(400).json({ message: "Graffiti id not found" });

  const result = await graffiti.deleteOne();
  const reply = `Entry deleted successfully: ${result.acknowledged}`;

  res.json(reply);
});

// gets a graffiti by id
// route = graffitis/{_id}
const getGraffiti = asyncHandler(async (req, res) => {
  const jwt = require("njwt");
  let token = "";
  var tokenCheck = false;

  for (let i = 0; i < req.rawHeaders.length; i++) {
    if (req.rawHeaders[i] === "Auth") {
      quotesToken = req.rawHeaders[i + 1];
      token = quotesToken.replace(/^["'](.+(?=["']$))["']$/, "$1");
    }
  }
  await jwt.verify(token, "graf-token-secret", (err, verifiedJwt) => {
    if (err) {
      console.log("failed at token check");
    } else {
      tokenCheck = true;
    }
  });

  if (!tokenCheck) {
    return res.status(401).json({ message: "Token authentication failed" });
  }
  const { id } = req.params;
  if (!id) return res.status(400).json({ messaage: "Graffiti id required" });

  const graffiti = await Graffiti.findById(id).exec();

  if (!graffiti)
    return res.status(400).json({ message: "Graffiti id not found" });

  return res.json(graffiti);
});

const searchGraffiti = asyncHandler(async (req, res) => {
  const queryString = require("node:querystring");
  const q = queryString.parse();
  console.log(q);

  console.log("this has been hit");

  return res.status(201).json({ message: "test" });
});

module.exports = {
  getAllGraffiti,
  createNewGraffiti,
  updateGraffiti,
  deleteGraffiti,
  getGraffiti,
};
