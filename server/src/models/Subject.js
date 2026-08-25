import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const subject = new Schema(
    {
        subjectId: {
            type: Number,
            required: true,
            unique: true,
            min: 1
        },
        subjectName: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 100
        },
        deptId: {
            type: [Number],
            required: true,
            validate: {
                validator: function (value) {
                    return (
                        Array.isArray(value) &&
                        value.length > 0 &&
                        value.every(
                            id => Number.isInteger(id) && id > 0
                        )
                    );
                },
                message: "Department IDs must be positive integers"
            }
        }
    }, {
    timestamps: true
})
const Subject = model('Subject', subject);
export default Subject;