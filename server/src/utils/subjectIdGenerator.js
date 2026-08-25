import Subject from "../models/Subject.js";

export const generateSubjectId = async () => {
    const lastSubject = await Subject
        .findOne()
        .sort({ subjectId: -1 })
        .select("subjectId");

    if (!lastSubject) {
        return 1;
    }

    return lastSubject.subjectId + 1;
};