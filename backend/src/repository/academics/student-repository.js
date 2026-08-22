const CrudRepository = require('../crud-repository');
const Student = require('../../model/Academic/Student');

/**
 * Data-access layer for the Student model.
 * Inherits the generic CRUD methods and adds Student-specific queries.
 */
class StudentRepository extends CrudRepository {
    constructor() {
        super(Student);
    }

    /**
     * email -> the email to search a student by
     * returns the student matching the email (or null)
     */
    async findByEmail(email) {
        const student = await this.model.findOne({ email });
        return student;
    }

    /**
     * id -> the student id whose profile (with populated exam results) is fetched
     * returns the student without sensitive/timestamp fields (or null)
     */
    async getProfileWithResults(id) {
        return this.model
            .findById(id)
            .select('-password -createdAt -updatedAt')
            .populate('examResults');
    }

    /**
     * id    -> the student to push onto
     * field -> the array field name on the student (e.g. 'examResults')
     * value -> the id/value to push into that array
     * returns the saved student document (or null when not found)
     */
    async pushToField(id, field, value) {
        const student = await this.model.findById(id);
        if (!student) {
            return null;
        }
        student[field].push(value);
        await student.save();
        return student;
    }
}

module.exports = StudentRepository;
