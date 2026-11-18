const express = require("express");

const router = express.Router();

const EmployeeRouter = require("./employeerouter");

router.use( "/" , EmployeeRouter);

module.exports = router;