import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const subject = new Schema(
    {
        subjectId: {
            type: Number,
            required: true,
            unique: true
        },
        subjectName: {
            type: String,
            required: true,
            unique: true
        },
        deptId: {
            type: [Number],
            required: true
        }
    }, {
    timestamps: true
})
const Subject = model('Subject', subject);
export default Subject;