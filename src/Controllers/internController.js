const internModel = require("../Models/internModel");

const createIntern = async function (req, res) {
  try {
    //retrieving data sent from middleware
    let data = req.body;
    let collegeCheck = req.collegeCheck;

    let collegeId = collegeCheck._id;
    data.collegeId = collegeId;

    const internData = await internModel.create(data);

    return res.status(201).send({status: true,message: `Successfully applied for internship at ${data.collegeName}.`,data: { name : internData.name, email : internData.email , mobile : internData.mobile , collegeId : internData.collegeId , isDeleted : internData.isDeleted }
    });
  } 
  catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports = { createIntern };
