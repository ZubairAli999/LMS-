const AcademicYearRepository = require('../../repository/academics/academicYear-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const academicYearRepository = new AcademicYearRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing details of the new academic year to be created
 * returns the newly created academic year object
 */
const createAcademicYear = async (data) => {
    try {
        const academicYearFound = await academicYearRepository.findByName(data.name);
        if (academicYearFound) {
            logger.warn(`Academic year already exists with name: ${data.name}`);
            throw {
                err: 'Academic year already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const academicYearCreated = await academicYearRepository.create({
            name: data.name,
            fromYear: data.fromYear,
            toYear: data.toYear,
            createdBy: data.userId,
        });
        // push the created year into the admin
        await adminRepository.pushToField(data.userId, 'academicYear', academicYearCreated._id);

        logger.info(`Academic year created in database with ID: ${academicYearCreated._id}`);
        return academicYearCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Academic year validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating academic year: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the academic year to be fetched
 * returns the academic year object matching the id
 */
const getAcademicYear = async (id) => {
    const academicYear = await academicYearRepository.get(id);
    if (!academicYear) {
        throw {
            err: 'No academic year found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return academicYear;
};

/**
 * id   -> id used to identify the academic year to be updated
 * data -> object containing the fields to update
 * returns the updated academic year object
 */
const updateAcademicYear = async (id, data) => {
    try {
        const academicYearFound = await academicYearRepository.findByName(data.name);
        if (academicYearFound) {
            logger.warn(`Academic year already exists with name: ${data.name}`);
            throw {
                err: 'Academic year already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const academicYear = await academicYearRepository.update(id, {
            name: data.name,
            fromYear: data.fromYear,
            toYear: data.toYear,
            createdBy: data.userId,
        });
        logger.info(`Academic year updated in database with ID: ${id}`);
        return academicYear;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Academic year validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating academic year with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the academic year to be deleted
 * returns the deleted academic year object
 */
const deleteAcademicYear = async (id) => {
    try {
        const response = await academicYearRepository.destroy(id);
        if (!response) {
            logger.warn(`No academic year found for deletion with ID: ${id}`);
            throw {
                err: 'No academic year record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Academic year deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting academic year with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createAcademicYear,
    getAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
};
