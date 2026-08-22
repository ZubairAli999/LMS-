const AcademicTermRepository = require('../../repository/academics/academicTerm-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const academicTermRepository = new AcademicTermRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing details of the new academic term to be created
 * returns the newly created academic term object
 */
const createAcademicTerm = async (data) => {
    try {
        const academicTermFound = await academicTermRepository.findByName(data.name);
        if (academicTermFound) {
            logger.warn(`Academic term already exists with name: ${data.name}`);
            throw {
                err: 'Academic term already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const academicTermCreated = await academicTermRepository.create({
            name: data.name,
            description: data.description,
            duration: data.duration,
            createdBy: data.userId,
        });
        // push the created term into the admin
        await adminRepository.pushToField(data.userId, 'academicTerms', academicTermCreated._id);

        logger.info(`Academic term created in database with ID: ${academicTermCreated._id}`);
        return academicTermCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Academic term validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating academic term: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the academic term to be fetched
 * returns the academic term object matching the id
 */
const getAcademicTerm = async (id) => {
    const academicTerm = await academicTermRepository.get(id);
    if (!academicTerm) {
        throw {
            err: 'No academic term found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return academicTerm;
};

/**
 * id   -> id used to identify the academic term to be updated
 * data -> object containing the fields to update
 * returns the updated academic term object
 */
const updateAcademicTerm = async (id, data) => {
    try {
        const academicTermFound = await academicTermRepository.findByName(data.name);
        if (academicTermFound) {
            logger.warn(`Academic term already exists with name: ${data.name}`);
            throw {
                err: 'Academic term already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const academicTerm = await academicTermRepository.update(id, {
            name: data.name,
            description: data.description,
            duration: data.duration,
            createdBy: data.userId,
        });
        logger.info(`Academic term updated in database with ID: ${id}`);
        return academicTerm;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Academic term validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating academic term with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the academic term to be deleted
 * returns the deleted academic term object
 */
const deleteAcademicTerm = async (id) => {
    try {
        const response = await academicTermRepository.destroy(id);
        if (!response) {
            logger.warn(`No academic term found for deletion with ID: ${id}`);
            throw {
                err: 'No academic term record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Academic term deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting academic term with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createAcademicTerm,
    getAcademicTerm,
    updateAcademicTerm,
    deleteAcademicTerm,
};
