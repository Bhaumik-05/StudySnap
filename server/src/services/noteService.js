import Note from "../models/Note.js";
import uploadPdf from "./cloudinaryService.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import DownloadHistory from "../models/downloadHistory.js";


export const createNoteService = async ({
    file, title, description, tag, semester,
    deptId, subjectId, uploadedBy, }) => {
    //error handling for  file
    if (!file) {
        const error = new Error("PDF file is required");
        error.statusCode = 400;
        throw error;
    }
    if (!title) {
        const error = new Error("Title is required");
        error.statusCode = 400;
        throw error;
    }

    if (!semester) {
        const error = new Error("Semester is required");
        error.statusCode = 400;
        throw error;
    }

    if (!deptId) {
        const error = new Error("Department ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (!subjectId) {
        const error = new Error("Subject ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (!uploadedBy) {
        const error = new Error("UploadedBy (user email) is required");
        error.statusCode = 400;
        throw error;
    }

    const semesterNumber = Number(semester);

    if (!Number.isInteger(semesterNumber) ||
        semesterNumber < 1 ||
        semesterNumber > 8) {

        const error = new Error("Semester must be an integer between 1 and 8");
        error.statusCode = 400;
        throw error;
    }
    const departmentId = Number(deptId);
    const subjectIdNumber = Number(subjectId);

    if (!Number.isInteger(departmentId)) {
        const error = new Error("Department ID must be a valid number");
        error.statusCode = 400;
        throw error;
    }


    if (!Number.isInteger(subjectIdNumber)) {
        const error = new Error("Subject ID must be a valid number");
        error.statusCode = 400;
        throw error;
    }

    const existingDepartment = await Department.findOne({ deptId: departmentId });
    if (!existingDepartment) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    const existingSubject = await Subject.findOne({
        subjectId: subjectIdNumber,
        deptId: departmentId
    });

    if (!existingSubject) {
        const error = new Error(
            "Subject not found or subject does not belong to this department"
        );
        error.statusCode = 404;
        throw error;
    }

    const existingUser = await User.findOne({ email: uploadedBy });
    if (!existingUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // 1. Upload PDF to Cloudinary
    const cloudinaryResult = await uploadPdf(file.buffer);

    // 2. Generate noteId
    const lastNote = await Note.findOne()
        .sort({ noteId: -1 })
        .select("noteId");

    const noteId = lastNote ? lastNote.noteId + 1 : 1;
    // Prepare tags
    let tags = [];

    if (tag) {
        tags = Array.isArray(tag) ? tag : [tag];
    }

    // Allowed tags
    const allowedTags = ["red", "blue", "yellow"];

    // Check every tag
    for (const currentTag of tags) {

        if (!allowedTags.includes(currentTag.toLowerCase())) {
            const error = new Error(
                "Tags can only be red, blue or yellow"
            );

            error.statusCode = 400;
            throw error;
        }
    }

    // Convert tags to lowercase
    tags = tags.map(currentTag => currentTag.toLowerCase());

    // 4. Create Note
    try {
        const note = await Note.create({
            noteId,

            title,

            description,

            tag: tags,

            semester: Number(semester),

            deptId: departmentId,

            subjectId: subjectIdNumber,

            uploadedBy,

            pdfUrl: cloudinaryResult.secure_url,

            pdfPublicId: cloudinaryResult.public_id,

            status: "pending",

            downloadCount: 0,

            uploadDate: new Date(),
        });

        return note;
    }
    catch (error) {
        // If Cloudinary upload succeeded but MongoDB
        // Note.create() failed, the PDF would otherwise
        // remain in Cloudinary without a corresponding Note.
        //
        // Therefore, delete the uploaded PDF from Cloudinary
        // to avoid an orphaned file.

        try {
            await cloudinary.uploader.destroy(
                cloudinaryResult.public_id,
                {
                    resource_type: "raw"
                }
            );
        } catch (cleanupError) {

            // Log cleanup error, but keep the original
            // database error as the main error.
            console.error(
                "Failed to cleanup Cloudinary file:",
                cleanupError
            );
        }

        // Re-throw the original database error so that
        // the controller/global error handler can handle it.
        const rethrowError = new Error("Something went wrong");
        rethrowError.statusCode = 503;
        throw rethrowError;
    }

};

export const getApprovedNotesService = async () => {
    const notes = await Note.find({
        status: "approved",
    }).sort({
        approvedDate: -1,
    });

    return notes;
};

export const getPendingNotesService = async () => {
    const notes = await Note.find({
        status: "pending",
    }).sort({
        uploadDate: -1,
    });

    return notes;
};

export const getApprovedNotesByIdService = async (noteId) => {

    console.log("Service noteId:", noteId);

    if (!noteId || isNaN(Number(noteId))) {
        const error = new Error("Valid noteId is required");
        error.statusCode = 400;
        throw error;
    }

    const note = await Note.findOne({
        noteId: Number(noteId),
        status: "approved",
    });

    if (!note) {
        const error = new Error("Approved note not found");
        error.statusCode = 404;
        throw error;
    }

    return note;
};

export const getRejectedNotesService = async () => {
    const notes = await Note.find({
        status: "rejected",
    }).sort({
        uploadDate: -1,
    });

    return notes;
};

export const downloadNoteService = async (noteId, userId) => {
    // Validate noteId
    if (!noteId || isNaN(noteId)) {
        return res.status(400).json({
            success: false,
            message: "Valid noteId is required",
        });
    }
    //atomic operation
    const updatedNote = await Note.findOneAndUpdate(
        {
            noteId: Number(noteId),
            status: "approved",
        },
        {
            $inc: {
                downloadCount: 1,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedNote) {
        const error = new Error("Approved note not found");
        error.statusCode = 404;
        throw error;
    }

    await DownloadHistory.create({
        noteId: updatedNote.noteId,
        userId,
        downloadDate: new Date(),
    });

    return {
        pdfUrl: updatedNote.pdfUrl,
        fileName: `${updatedNote.title}.pdf`,
        downloadCount: updatedNote.downloadCount,
    };
};

export const getUserUploadHistoryService = async (userEmail) => {

    console.log("SERVICE USER EMAIL:", userEmail);

    const notes = await Note.find({
        uploadedBy: userEmail,
    }).sort({
        uploadDate: -1,
    });

    console.log("MONGODB RESULT:", notes);

    return notes;
};