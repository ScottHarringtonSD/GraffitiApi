const { json } = require("express");
const Graffiti = require("../Models/Graffiti");
const asyncHandler = require("express-async-handler");

// Get all graffiti
// route = /graffitis GET
const getAllGraffiti = asyncHandler(async (req, res) => {
  const graffitis = await Graffiti.find().lean().exec();
  if (!graffitis?.length)
    return res.status(400).json({ message: "No graffiti found" });

  res.json(graffitis);
});

// Create new Graffiti
// route = /graffitis POST
const createNewGraffiti = asyncHandler(async (req, res) => {
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
// @route Delete /graffiti
const deleteGraffiti = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ messaage: "Graffiti id required" });

  const graffiti = await Graffiti.findById(id).exec();
  if (!graffiti)
    return res.status(400).json({ message: "Graffiti id not found" });

  const result = await graffiti.deleteOne();
  const reply = `Entry deleted successfully: ${result.acknowledged}`;

  res.json(reply);
});

// gets a graffiti by id
//route = graffitis/{_id}
const getGraffiti = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ messaage: "Graffiti id required" });

  const graffiti = await Graffiti.findById(id).exec();

  if (!graffiti)
    return res.status(400).json({ message: "Graffiti id not found" });

  const rawResponse = res.json(graffiti);
  res.json(graffiti);
});

module.exports = {
  getAllGraffiti,
  createNewGraffiti,
  updateGraffiti,
  deleteGraffiti,
  getGraffiti,
};
