const CrudRepository = require('../crud-repository');
const ExamResults = require('../../model/Academic/ExamResults');

/**
 * Data-access layer for the ExamResults model.
 * Inherits the generic CRUD methods and adds ExamResults-specific queries
 * such as fetching a student's populated result and listing exams.
 */
class ExamResultsRepository extends CrudRepository {
    constructor() {
        super(ExamResults);
    }

    /**
     * studentId -> the student identifier stored on the result
     * resultId  -> id of the exam result to fetch
     * returns the matching result with related documents populated (or null)
     */
    async findPublishedForStudent(studentId, resultId) {
        return this.model
            .findOne({ studentID: studentId, _id: resultId })
            .populate('exam')
            .populate('classLevel')
            .populate('academicTerm')
            .populate('academicYear');
    }

    /**
     * returns all exam results with only the exam field selected and populated
     */
    async getAllWithExam() {
        return this.model.find().select('exam').populate('exam');
    }

    /**
     * studentId -> the student ObjectId stored on the result
     * returns the exam result for that student (or null)
     */
    async findByStudent(studentId) {
        return this.model.findOne({ student: studentId });
    }
}

module.exports = ExamResultsRepository;
