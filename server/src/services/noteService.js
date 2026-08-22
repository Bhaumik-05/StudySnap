import Note from "../models/Note.js";
import uploadPdf from "./cloudinaryService.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";

const createNoteService = async ({
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

    if (semester < 1 || semester > 8) {
        const error = new Error("Semester must be between 1 and 8");
        error.statusCode = 400;
        throw error;
    }

    const existingDepartment = await Department.findOne({ deptId: Number(deptId) });
    if (!existingDepartment) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    const existingSubject = await Subject.findOne({
        subjectId: Number(subjectId),
        deptId: Number(deptId)
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
    const note = await Note.create({
        noteId,

        title,

        description,

        tag: tags,

        semester: Number(semester),

        deptId: Number(deptId),

        subjectId: Number(subjectId),

        uploadedBy,

        pdfUrl: cloudinaryResult.secure_url,

        pdfPublicId: cloudinaryResult.public_id,

        status: "pending",

        downloadCount: 0,

        uploadDate: new Date(),
    });

    return note;
};

export default createNoteService;