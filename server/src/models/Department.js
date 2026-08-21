import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const department = new Schema(
    {
        deptId: {
            type: Number,
            required: true
        },
        deptName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Department = model('Department', department);

export default Department;