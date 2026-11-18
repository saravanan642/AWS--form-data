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

        const { employeeName, employeeEmail } = req.body;

        const file = req.file;

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

        const imageKey = `employees/${randomUUID()}-${file.originalname}`;

        const command = new PutObjectCommand({

            Bucket: process.env.AWS_BUCKET_NAME,

            Key: imageKey,

            Body: file.buffer,

            ContentType: file.mimetype

        });

        await s3.send(command);

        const employee = await EmployeeModel.create({

            employeeName,
            employeeEmail,
            employeeImage: imageKey

        });

        res.status(201).json({

            message: "Employee Created Successfully",

            employee

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Employee Creation Failed",

            error: error.message

        });

    }

};


// GENERATE IMAGE URL
const GetEmployeeImage = async (req, res) => {

    try {

        const employee = await EmployeeModel.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        const command = new GetObjectCommand({

            Bucket: process.env.AWS_BUCKET_NAME,

            Key: employee.employeeImage

        });

        const imageUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600
        });

        res.status(200).json({

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