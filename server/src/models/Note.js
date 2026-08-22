import mongoose from "mongoose";

const { Schema, model } = mongoose;

const note = new Schema(
    {
        noteId: {
            type: Number,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        tag: {
            type: [String],
            enum: ['BLUE', 'RED', 'YELLOW'],
            default: []
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },

        uploadDate: {
            type: Date,
            default: Date.now
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
        },

        downloadCount: {
            type: Number,
            default: 0
        },

        approvedDate: {
            type: Date
        },

        rejectionReason: {
            type: String
        },

        pdfUrl: {
            type: String,
            required: true
        },

        deptId: {
            type: Number,
            required: true
        },

        subjectId: {
            type: Number,
            required: true
        },

        uploadedBy: {
            type: String,
            required: true
        },

        approvedBy: {
            type: String
        },
        pdfPublicId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Note = model('Note', note);

export default Note;