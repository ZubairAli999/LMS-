const CrudRepository = require('../crud-repository');
const Teacher = require('../../model/Staff/Teacher');

/**
 * Data-access layer for the Teacher model.
 * Inherits the generic CRUD methods and adds Teacher-specific queries such as
 * email lookup and pushing related ids onto the teacher.
 */
class TeacherRepository extends CrudRepository {
    constructor() {
        super(Teacher);
    }

    /**
     * email -> the email to search a teacher by
     * returns the teacher matching the email (or null)
     */
    async findByEmail(email) {
        const teacher = await this.model.findOne({ email });
        return teacher;
    }

    /**
     * id -> the teacher id whose profile (sans password/timestamps) should be fetched
     * returns the teacher document (or null)
     */
    async getProfile(id) {
        const teacher = await this.model.findById(id).select('-password -createdAt -updatedAt');
        return teacher;
    }

    /**
     * id    -> the teacher to push onto
     * field -> the array field name on the teacher (e.g. 'examsCreated')
     * value -> the id/value to push into that array
     * returns the saved teacher document (or null when not found)
     */
    async pushToField(id, field, value) {
        const teacher = await this.model.findById(id);
        if (!teacher) {
            return null;
        }
        teacher[field].push(value);
        await teacher.save();
        return teacher;
    }
}

module.exports = TeacherRepository;
