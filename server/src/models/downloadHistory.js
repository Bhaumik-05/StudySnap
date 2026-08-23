import mongoose from "mongoose";

const { Schema, model } = mongoose;

const downloadHistory = new Schema(
    {
        noteId: {
            type: Number,
            required: true
        },

        userId: {
            type: String,
            required: true
        },

        downloadDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const DownloadHistory = model(
    "DownloadHistory",
    downloadHistory
);

export default DownloadHistory;