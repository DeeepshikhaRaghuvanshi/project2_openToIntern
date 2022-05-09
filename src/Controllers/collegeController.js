const collegeModel = require("../Models/collegeModel");


const createCollege = async function (req, res) {
  try {
    let body = req.body;
    let savedData = await collegeModel.create(body);
    res.status(201).send({ status : true, data: {name : savedData.name , fullName : savedData.fullName , logoLink : savedData.logoLink , isDeleted : savedData.isDeleted} });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};


const getCollege = async function (req, res) {
  try {
     //retrieving data sent from middleware
    let interns = req.interns;
    let collegeNames = req.collegeNames;
    const { name, fullName, logoLink } = collegeNames;

    // Final list of College details with students name who applied for internship
    const finalData = {
      name: name,
      fullName: fullName,
      logoLink: logoLink,
      interests: interns.length? interns: { message: "No one applied for internship in this college" },
    };

    return res.status(200).send({ status: true, data: finalData });
  } 
  catch (err) {
    console.log("This is the error : ", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
module.exports = { createCollege, getCollege };
