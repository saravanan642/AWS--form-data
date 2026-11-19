const EmployeeModel = require("../models/Employeemodel");

const s3 = require("../config/aws");

const {
    PutObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
    getSignedUrl
} = require("@aws-sdk/s3-request-presigner");

const { randomUUID } = require("crypto");


// CREATE EMPLOYEE
const CreateEmployee = async (req, res) => {

    try {

        console.log("1. API Called");

        const { employeeName, employeeEmail } = req.body;

        const file = req.file;

        console.log("2. Employee Details Received");

        if (!employeeName || !employeeEmail) {
            return res.status(400).json({
                message: "Employee details are required"
            });
        }

        if (!file) {
            return res.status(400).json({
                message: "Please upload employee image"
            });
        }

        console.log("3. Image Received");

        const imageKey = `employees/${randomUUID()}-${file.originalname}`;

        const command = new PutObjectCommand({

            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
            Body: file.buffer,
            ContentType: file.mimetype

        });

        console.log("4. Uploading Image To S3");

        await s3.send(command);

        console.log("5. Image Uploaded Successfully");

        const employee = await EmployeeModel.create({

            employeeName,
            employeeEmail,
            employeeImage: imageKey

        });

        console.log("6. Employee Saved In DB");

        res.status(201).json({

            message: "Employee Created Successfully",
            employee

        });

    }

    catch (error) {

        console.log("ERROR:", error);

        res.status(500).json({

            message: "Employee Creation Failed",
            error: error.message

        });

    }

};

// GENERATE IMAGE URL

const GetEmployeeImage = async (req, res) => {

    try {

        console.log("Employee ID:", req.params.id);

        const employee = await EmployeeModel.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${employee.employeeImage}`;

        res.status(200).json({
            message: "Employee Image Fetched Successfully",
            imageUrl
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Image URL Generation Failed",
            error: error.message
        });

    }

};



module.exports = {
    CreateEmployee,
    GetEmployeeImage
};