const ProgramRepository = require('../../repository/academics/program-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const programRepository = new ProgramRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing details of the new program to be created
 * returns the newly created program object
 */
const createProgram = async (data) => {
    try {
        const programFound = await programRepository.findByName(data.name);
        if (programFound) {
            logger.warn(`Program already exists with name: ${data.name}`);
            throw {
                err: 'Program already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const programCreated = await programRepository.create({
            name: data.name,
            description: data.description,
            createdBy: data.userId,
        });
        // push the created program into the admin
        await adminRepository.pushToField(data.userId, 'programs', programCreated._id);

        logger.info(`Program created in database with ID: ${programCreated._id}`);
        return programCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Program validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating program: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the program to be fetched
 * returns the program object matching the id
 */
const getProgram = async (id) => {
    const program = await programRepository.get(id);
    if (!program) {
        throw {
            err: 'No program found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return program;
};

/**
 * id   -> id used to identify the program to be updated
 * data -> object containing the fields to update
 * returns the updated program object
 */
const updateProgram = async (id, data) => {
    try {
        const programFound = await programRepository.findByName(data.name);
        if (programFound) {
            logger.warn(`Program already exists with name: ${data.name}`);
            throw {
                err: 'Program already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const program = await programRepository.update(id, {
            name: data.name,
            description: data.description,
            createdBy: data.userId,
        });
        logger.info(`Program updated in database with ID: ${id}`);
        return program;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Program validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating program with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the program to be deleted
 * returns the deleted program object
 */
const deleteProgram = async (id) => {
    try {
        const response = await programRepository.destroy(id);
        if (!response) {
            logger.warn(`No program found for deletion with ID: ${id}`);
            throw {
                err: 'No program record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Program deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting program with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createProgram,
    getProgram,
    updateProgram,
    deleteProgram,
};
