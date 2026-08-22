const ClassLevelRepository = require('../../repository/academics/classLevel-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const classLevelRepository = new ClassLevelRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing details of the new class level to be created
 * returns the newly created class level object
 */
const createClassLevel = async (data) => {
    try {
        const classLevelFound = await classLevelRepository.findByName(data.name);
        if (classLevelFound) {
            logger.warn(`Class level already exists with name: ${data.name}`);
            throw {
                err: 'Class level already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const classLevelCreated = await classLevelRepository.create({
            name: data.name,
            description: data.description,
            createdBy: data.userId,
        });
        // push the created class level into the admin
        await adminRepository.pushToField(data.userId, 'classLevels', classLevelCreated._id);

        logger.info(`Class level created in database with ID: ${classLevelCreated._id}`);
        return classLevelCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Class level validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating class level: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the class level to be fetched
 * returns the class level object matching the id
 */
const getClassLevel = async (id) => {
    const classLevel = await classLevelRepository.get(id);
    if (!classLevel) {
        throw {
            err: 'No class level found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return classLevel;
};

/**
 * id   -> id used to identify the class level to be updated
 * data -> object containing the fields to update
 * returns the updated class level object
 */
const updateClassLevel = async (id, data) => {
    try {
        const classLevelFound = await classLevelRepository.findByName(data.name);
        if (classLevelFound) {
            logger.warn(`Class level already exists with name: ${data.name}`);
            throw {
                err: 'Class level already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const classLevel = await classLevelRepository.update(id, {
            name: data.name,
            description: data.description,
            createdBy: data.userId,
        });
        logger.info(`Class level updated in database with ID: ${id}`);
        return classLevel;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Class level validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating class level with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the class level to be deleted
 * returns the deleted class level object
 */
const deleteClassLevel = async (id) => {
    try {
        const response = await classLevelRepository.destroy(id);
        if (!response) {
            logger.warn(`No class level found for deletion with ID: ${id}`);
            throw {
                err: 'No class level record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Class level deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting class level with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createClassLevel,
    getClassLevel,
    updateClassLevel,
    deleteClassLevel,
};
