const CrudRepository = require('../crud-repository');
const Admin = require('../../model/Staff/Admin');

/**
 * Data-access layer for the Admin model.
 * Inherits the generic CRUD methods and adds Admin-specific queries such as
 * email lookup, populated profile fetch, and pushing related ids onto the admin.
 */
class AdminRepository extends CrudRepository {
    constructor() {
        super(Admin);
    }

    /**
     * email -> the email to search an admin by
     * returns the admin matching the email (or null)
     */
    async findByEmail(email) {
        const admin = await this.model.findOne({ email });
        return admin;
    }

    /**
     * id -> the admin id whose full, populated profile should be fetched
     * returns the admin with related documents populated (or null)
     */
    async getProfile(id) {
        const admin = await this.model
            .findById(id)
            .select('-password -createdAt -updatedAt')
            .populate('academicYear')
            .populate('academicTerms')
            .populate('programs')
            .populate('yearGroups')
            .populate('classLevels')
            .populate('teachers')
            .populate('students');
        return admin;
    }

    /**
     * adminId -> the admin to push onto
     * field   -> the array field name on the admin (e.g. 'academicTerms')
     * value   -> the id/value to push into that array
     * returns the saved admin document
     */
    async pushToField(adminId, field, value) {
        const admin = await this.model.findById(adminId);
        if (!admin) {
            return null;
        }
        admin[field].push(value);
        await admin.save();
        return admin;
    }
}

module.exports = AdminRepository;
