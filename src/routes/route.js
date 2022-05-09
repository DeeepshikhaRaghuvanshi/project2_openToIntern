
const express = require("express");
const router = express.Router();
const collegeController = require("../Controllers/collegeController");
const internController = require("../Controllers/internController");

const {validateCollegeCreate, collegeValidationResult, validatedCollegeCreateDB,validateCollegeDB} = require("../middlewares/validation/college");
const {validateIntern,internValidationResult,validateInternDB} = require("../middlewares/validation/intern");



router.post("/functionup/colleges",validateCollegeCreate,collegeValidationResult,validatedCollegeCreateDB,collegeController.createCollege);

router.post("/functionup/interns",validateIntern,internValidationResult,validateInternDB,internController.createIntern);

router.get("/functionup/collegeDetails",validateCollegeDB,collegeController.getCollege);

module.exports = router;
