const CrudRepository = require('../crud-repository');
const Exam = require('../../model/Academic/Exam');

/**
 * Data-access layer for the Exam model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds Exam-specific queries such as name lookup and pushing related ids.
 */
class ExamRepository extends CrudRepository {
    constructor() {
        super(Exam);
    }

    /**
     * name -> the name to search an exam by
     * returns the exam matching the name (or null)
     */
    async findByName(name) {
        const exam = await this.model.findOne({ name });
        return exam;
    }

    /**
     * id    -> the exam to push onto
     * field -> the array field name on the exam (e.g. 'questions')
     * value -> the id/value to push into that array
     * returns the saved exam document (or null when not found)
     */
    async pushToField(id, field, value) {
        const exam = await this.model.findById(id);
        if (!exam) {
            return null;
        }
        exam[field].push(value);
        await exam.save();
        return exam;
    }

    /**
     * id -> the exam to fetch with its questions and academic term populated
     * returns the exam with populated questions and academicTerm (or null)
     */
    async getWithQuestionsAndTerm(id) {
        return this.model
            .findById(id)
            .populate('questions')
            .populate('academicTerm');
    }
}

module.exports = ExamRepository;
