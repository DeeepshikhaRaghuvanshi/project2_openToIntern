const { check, validationResult } = require("express-validator/check");
const internModel = require("../../Models/internModel");
const collegeModel = require("../../Models/collegeModel");

//POST/functionup/interns  : server-side validations
exports.validateIntern = [
  check("name").trim().not().isEmpty().withMessage("name is a rquired field").not().isNumeric().withMessage("invalid name, can't be numeric").isLength({ min: 4, max: 30}).withMessage("name must be within 4 to 30 characters"),
  
  check("email").not().isEmpty().withMessage("email is a required field").normalizeEmail().isEmail().withMessage("invalid email-Id"),
  
  check("mobile").trim().not().isEmpty().withMessage("mobile is a required field").isNumeric().isLength({ min: 10, max: 10 }).withMessage("invalid mobile number, should contain 10 digits"),
  
  check("collegeName").trim().not().isEmpty().withMessage("collegeName is a rquired field").not().isNumeric().withMessage("invalid collegeName, can't be numeric")
];

exports.internValidationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.status(400).send({ status: false, msg: error });
};


// POST/functionup/interns : Validations for duplicate data
exports.validateInternDB = async (req, res, next) => {
  let data = req.body;
  if (data.isDeleted === true) {
    return res.status(400).send({ status: false, message: "Newly created data cant be deleted" });
  }

  //checking duplicate mobile number
  let numberCheck = await internModel.findOne({ mobile: data.mobile });
  if (numberCheck)
    return res.status(400).send({ status: false, msg: "Mobile Number Already Exists" });

  //checking duplicate email
  let emailCheck = await internModel.findOne({ email: data.email });
  if (emailCheck)
    return res.status(400).send({ status: false, msg: "EmailId Already Exists" });

    //checking duplicate college
  let collegeCheck = await collegeModel.findOne({name: data.collegeName,isDeleted: false,});
  if (!collegeCheck) {
    return res.status(400).send({status: false, message: `${data.collegeName} college doesn't exists.`,});
  }

  //passing data to handler
  req.collegeCheck = collegeCheck;
  next();
};


