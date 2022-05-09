const { check, validationResult } = require("express-validator/check");
const collegeModel = require("../../Models/collegeModel");
const internModel = require("../../Models/internModel");

//POST/functionup/colleges  : server-side validations
exports.validateCollegeCreate = [
  check("name").trim().not().isEmpty().withMessage("name is a required field").not().isNumeric().withMessage("invalid name , can't be numeric").isLength({ min: 3, max: 20 }).withMessage("name must be within 3 to 20 characters"),     
  
  check("fullName").trim().not().isEmpty().withMessage("fullName is a required field").not().isNumeric().withMessage("invalid name, can't be numeric").isLength({ min: 5, max: 50 }).withMessage("fullName must be within 3 to 50 characters"),
  
  check("logoLink").trim().not().isEmpty().withMessage("logoLink is a required field").isURL().withMessage("not a valid url")
];

exports.collegeValidationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next()
  const error = result[0].msg;
  res.status(400).send({ status: false, msg: error });
};


// POST/functionup/colleges  : Validations for duplicate data
exports.validatedCollegeCreateDB = async (req, res, next) => {
    const body = req.body;
    if(body.isDeleted&&body.isDeleted !=true)
    return res.status(400).send({status : false , message : "only false value is accepted in isDeleted key"})
  
  //check if name is abbreviated or not
    if (body.name.split(" ").length > 1) 
    return res.status(400).send({ status: false, msg: "please provide the Valid Abbreviation" });

    // Checking duplicate name
    const duplicateName = await collegeModel.findOne({ name: body.name });
    if (duplicateName) 
      return res.status(400).send({ status: false, msg: "College Name already exists" });

    //Checking duplicate Logo Link
    const duplicatelogoLink = await collegeModel.findOne({logoLink: body.logoLink,});
    if (duplicatelogoLink) 
      return res.status(409).send({status: false,msg: "The logo link which you have entered belong to some other college"});
  
  // isDeleted should be false
    if (body.isDeleted === true) 
    return res.status(400).send({ status: false, msg: "New entries can't be deleted" });
  
   next();
};


//GET//functionup/collegeDetails : Validations for duplicate data
exports.validateCollegeDB = async (req, res, next) => {
  let collegeName = req.query.collegeName;
  if(!collegeName)
  return res.status(400).send({status : false , message : "Enter the name of college"})

  const collegeNames = await collegeModel.findOne({ name: collegeName });
  if (!collegeNames) 
    return res.status(404).send({status: false, message: "College Not Found" });
  const collegeId = collegeNames._id;
  const interns = await internModel.find({ collegeId: collegeId , isDeleted : false }).select({ _id: 1, email: 1, name: 1, mobile: 1 });

  req.interns = interns;
  req.collegeNames = collegeNames;
  next();
};
