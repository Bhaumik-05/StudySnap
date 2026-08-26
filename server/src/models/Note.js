import mongoose from "mongoose";

const { Schema, model } = mongoose;

const note = new Schema(
    {
        noteId: {
            type: Number,
            required: true,
            unique: true,
            min: [1, "Note ID must be a positive number"]
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [150, "Title cannot exceed 100 characters"]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },

        status: {
            type: String,
            enum: {
                values: ["pending", "approved", "rejected"],
                message: "Invalid note status"
            },
            default: 'pending'
        },

        uploadDate: {
            type: Date,
            default: Date.now
        },

        semester: {
            type: Number,
            required: true,
            min: [1, "Semester must be at least 1"],
            max: [8, "Semester cannot exceed 8"],
            validate: {
                validator: Number.isInteger,
                message: "Semester must be an integer"
            }
        },

        downloadCount: {
            type: Number,
            default: 0,
            min: [0, "Download count cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Download count must be an integer"
            }
        },

        approvedDate: {
            type: Date
        },

        rejectionReason: {
            type: String,
            trim: true,
            required: function () {
                return this.status === "rejected"
            }
        },

        pdfUrl: {
            type: String,
            required: true,
            trim: true
        },

        deptId: {
            type: Number,
            required: true,
            min: [1, "Department ID must be a positive number"],
            validate: {
                validator: Number.isInteger,
                message: "Department ID must be an integer"
            }
        },

        subjectId: {
            type: Number,
            required: true,
            min: [1, "Subject ID must be a positive number"],
            validate: {
                validator: Number.isInteger,
                message: "Subject ID must be an integer"
            }
        },

        uploadedBy: {
            type: String,
            required: true,
            trim: true
        },

        approvedBy: {
            type: String,
            trim: true
        },
        pdfPublicId: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Note = model('Note', note);

export default Note;