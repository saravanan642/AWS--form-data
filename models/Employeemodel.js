const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({

    employeeName: {
        type: String,
        required: true
    },

    employeeEmail: {
        type: String,
        required: true
    },

    employeeImage: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;