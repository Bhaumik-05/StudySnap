import Note from "../models/Note.js";
import uploadPdf from "./cloudinaryService.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import DownloadHistory from "../models/downloadHistory.js";
import NoteTag from "../models/noteTag.js";
import { generateNoteId } from "../utils/noteIdGenerator.js";


export const createNoteService = async ({
    file, title, description, semester,
    deptId, subjectId, uploadedBy, }) => {
    //error handling for  file


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

    const noteId = await generateNoteId();

    // 4. Create Note
    try {
        const note = await Note.create({
            noteId,


            title,


            description,

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


export const updateNoteStatusService = async (
    noteId,
    status,
    rejectionReason,
    adminEmail
) => {
    // Validate noteId
    if (!noteId || isNaN(Number(noteId))) {
        const error = new Error("Valid noteId is required");
        error.statusCode = 400;
        throw error;
    }


    // Validate status
    const allowedStatuses = ["approved", "rejected"];


    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            "Status can only be approved or rejected"
        );
        error.statusCode = 400;
        throw error;
    }


    // Find pending note
    const note = await Note.findOne({
        noteId: Number(noteId),
        status: "pending",
    });


    if (!note) {
        const error = new Error(
            "Pending note not found or note has already been reviewed"
        );
        error.statusCode = 404;
        throw error;
    }


    // If rejected, rejection reason is required
    if (
        status === "rejected" &&
        (!rejectionReason || !rejectionReason.trim())
    ) {
        const error = new Error(
            "Rejection reason is required when rejecting a note"
        );
        error.statusCode = 400;
        throw error;
    }


    // Update status
    note.status = status;


    // If approved
    if (status === "approved") {
        note.approvedDate = new Date();
        note.approvedBy = adminEmail;
        note.rejectionReason = undefined;
    }


    // If rejected
    if (status === "rejected") {
        note.rejectionReason = rejectionReason.trim();


        // Clear approval-related fields
        note.approvedDate = undefined;
        note.approvedBy = undefined;
    }


    await note.save();


    return note;
};




export const assignNoteTagService = async (noteId, userId, tag) => {


    if (!noteId || isNaN(noteId)) {
        const error = new Error("Valid noteId is required");
        error.statusCode = 400;
        throw error;
    }


    if (!tag) {
        const error = new Error("Tag is required");
        error.statusCode = 400;
        throw error;
    }


    const normalizedTag = tag.trim().toLowerCase();


    const allowedTags = ["red", "blue", "yellow"];


    if (!allowedTags.includes(normalizedTag)) {
        const error = new Error(
            "Tag can only be red, blue or yellow"
        );
        error.statusCode = 400;
        throw error;
    }


    // Make sure note exists and is approved
    const note = await Note.findOne({
        noteId: Number(noteId),
        status: "approved"
    });


    if (!note) {
        const error = new Error("Approved note not found");
        error.statusCode = 404;
        throw error;
    }


    // Create or update this user's tag
    const noteTag = await NoteTag.findOneAndUpdate(
        {
            noteId: Number(noteId),
            userId: userId
        },
        {
            $set: {
                tag: normalizedTag
            }
        },
        {
            new: true,
            upsert: true
        }
    );


    return noteTag;
};

// ============================================
// SEARCH + FILTER + PAGINATION
// ============================================

export const searchNotesService = async ({
    semester,
    deptId,
    subjectId,
    search,
    page = 1,
    limit = 10,
}) => {

    // ============================================
    // VALIDATE PAGINATION
    // ============================================

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        const error = new Error(
            "Page must be a positive integer"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
    ) {
        const error = new Error(
            "Limit must be an integer between 1 and 100"
        );
        error.statusCode = 400;
        throw error;
    }


    // ============================================
    // BASE FILTER
    // Only approved notes should be visible
    // ============================================

    const filter = {
        status: "approved",
    };


    // ============================================
    // SEMESTER FILTER
    // ============================================

    if (semester !== undefined) {

        const semesterNumber = Number(semester);

        if (
            !Number.isInteger(semesterNumber) ||
            semesterNumber < 1 ||
            semesterNumber > 8
        ) {
            const error = new Error(
                "Semester must be an integer between 1 and 8"
            );
            error.statusCode = 400;
            throw error;
        }

        filter.semester = semesterNumber;
    }


    // ============================================
    // DEPARTMENT FILTER
    // ============================================

    if (deptId !== undefined) {

        const departmentNumber = Number(deptId);

        if (!Number.isInteger(departmentNumber)) {
            const error = new Error(
                "Department ID must be a valid integer"
            );
            error.statusCode = 400;
            throw error;
        }

        filter.deptId = departmentNumber;
    }


    // ============================================
    // SUBJECT FILTER
    // ============================================

    if (subjectId !== undefined) {

        const subjectNumber = Number(subjectId);

        if (!Number.isInteger(subjectNumber)) {
            const error = new Error(
                "Subject ID must be a valid integer"
            );
            error.statusCode = 400;
            throw error;
        }

        filter.subjectId = subjectNumber;
    }


    // ============================================
    // SEARCH
    // Search in:
    // - title
    // - description
    // ============================================

    if (
        search !== undefined &&
        search.trim() !== ""
    ) {

        // Escape regex special characters
        const escapedSearch = search
            .trim()
            .replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const searchRegex = new RegExp(
            escapedSearch,
            "i"
        );

        filter.$or = [
            {
                title: {
                    $regex: searchRegex,
                },
            },
            {
                description: {
                    $regex: searchRegex,
                },
            },
        ];
    }


    // ============================================
    // PAGINATION
    // ============================================

    const skip =
        (pageNumber - 1) * limitNumber;


    // ============================================
    // DATABASE QUERY
    // ============================================

    const [notes, total] = await Promise.all([

        Note.find(filter)
            .sort({
                approvedDate: -1,
            })
            .skip(skip)
            .limit(limitNumber),

        Note.countDocuments(filter),

    ]);


    // ============================================
    // RESPONSE DATA
    // ============================================

    const totalPages =
        Math.ceil(total / limitNumber);


    return {
        notes,

        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages,
        },
    };
};