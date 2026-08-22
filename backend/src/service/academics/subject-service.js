const SubjectRepository = require('../../repository/academics/subject-repository');
const ProgramRepository = require('../../repository/academics/program-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const subjectRepository = new SubjectRepository();
const programRepository = new ProgramRepository();

/**
 * data -> object containing details of the new subject to be created (includes programID)
 * returns the newly created subject object
 */
const createSubject = async (data) => {
    try {
        const programFound = await programRepository.get(data.programID);
        if (!programFound) {
            logger.warn(`Program not found with ID: ${data.programID}`);
            throw {
                err: 'Program not found',
                code: STATUS.NOT_FOUND,
            };
        }
        const subjectFound = await subjectRepository.findByName(data.name);
        if (subjectFound) {
            logger.warn(`Subject already exists with name: ${data.name}`);
            throw {
                err: 'Subject already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const subjectCreated = await subjectRepository.create({
            name: data.name,
            description: data.description,
            academicTerm: data.academicTerm,
            createdBy: data.userId,
        });
        // push the created subject into the program
        await programRepository.pushToField(data.programID, 'subjects', subjectCreated._id);

        logger.info(`Subject created in database with ID: ${subjectCreated._id}`);
        return subjectCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Subject validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating subject: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the subject to be fetched
 * returns the subject object matching the id
 */
const getSubject = async (id) => {
    const subject = await subjectRepository.get(id);
    if (!subject) {
        throw {
            err: 'No subject found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return subject;
};

/**
 * id   -> id used to identify the subject to be updated
 * data -> object containing the fields to update
 * returns the updated subject object
 */
const updateSubject = async (id, data) => {
    try {
        const subjectFound = await subjectRepository.findByName(data.name);
        if (subjectFound) {
            logger.warn(`Subject already exists with name: ${data.name}`);
            throw {
                err: 'Subject already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const subject = await subjectRepository.update(id, {
            name: data.name,
            description: data.description,
            academicTerm: data.academicTerm,
            createdBy: data.userId,
        });
        logger.info(`Subject updated in database with ID: ${id}`);
        return subject;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Subject validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating subject with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the subject to be deleted
 * returns the deleted subject object
 */
const deleteSubject = async (id) => {
    try {
        const response = await subjectRepository.destroy(id);
        if (!response) {
            logger.warn(`No subject found for deletion with ID: ${id}`);
            throw {
                err: 'No subject record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Subject deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting subject with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject,
};
