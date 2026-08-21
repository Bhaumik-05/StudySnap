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