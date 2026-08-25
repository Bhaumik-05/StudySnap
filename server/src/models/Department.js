import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const department = new Schema(
    {
        deptId: {
            type: Number,
            required: [true, "Department ID is required"],
            unique: true,
            min: [1, "Department ID must be greater than 0"]
        },
        deptName: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            minlength: [2, "Department name is too short"]
        }
    },
    {
        timestamps: true
    }
)

const Department = model('Department', department);

export default Department;