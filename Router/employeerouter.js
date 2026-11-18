const express = require("express");

const router = express.Router();

const upload = require("../middleware/uplaod");

const { CreateEmployee, GetEmployeeImage} = require("../controller/Employeelogic");


router.post( "/create", upload.single("employeeImage"), CreateEmployee);

router.get("/image/:id", GetEmployeeImage);

module.exports = router;