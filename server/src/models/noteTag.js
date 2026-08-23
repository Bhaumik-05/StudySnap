import mongoose from "mongoose";

const { Schema, model } = mongoose;

const noteTagSchema = new Schema(
    {
        noteId: {
            type: Number,
            required: true
        },

        userId: {
            type: String,
            required: true
        },

        tag: {
            type: String,
            enum: ["red", "blue", "yellow"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

// One user can have only ONE tag for one note
noteTagSchema.index(
    { noteId: 1, userId: 1 },
    { unique: true }
);

const NoteTag = model("NoteTag", noteTagSchema);

export default NoteTag;