const YearGroupRepository = require('../../repository/academics/yearGroup-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const yearGroupRepository = new YearGroupRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing details of the new year group to be created
 * returns the newly created year group object
 */
const createYearGroup = async (data) => {
    try {
        const yearGroupFound = await yearGroupRepository.findByName(data.name);
        if (yearGroupFound) {
            logger.warn(`Year group already exists with name: ${data.name}`);
            throw {
                err: 'Year Group/Graduation Year already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const yearGroupCreated = await yearGroupRepository.create({
            name: data.name,
            academicYear: data.academicYear,
            createdBy: data.userId,
        });
        // find the admin
        const admin = await adminRepository.get(data.userId);
        if (!admin) {
            logger.warn(`Admin not found with ID: ${data.userId}`);
            throw {
                err: 'Admin not found',
                code: STATUS.NOT_FOUND,
            };
        }
        // push the created year group into the admin
        await adminRepository.pushToField(data.userId, 'yearGroups', yearGroupCreated._id);

        logger.info(`Year group created in database with ID: ${yearGroupCreated._id}`);
        return yearGroupCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Year group validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating year group: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the year group to be fetched
 * returns the year group object matching the id
 */
const getYearGroup = async (id) => {
    const yearGroup = await yearGroupRepository.get(id);
    if (!yearGroup) {
        throw {
            err: 'No year group found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return yearGroup;
};

/**
 * id   -> id used to identify the year group to be updated
 * data -> object containing the fields to update
 * returns the updated year group object
 */
const updateYearGroup = async (id, data) => {
    try {
        const yearGroupFound = await yearGroupRepository.findByName(data.name);
        if (yearGroupFound) {
            logger.warn(`Year group already exists with name: ${data.name}`);
            throw {
                err: 'Year Group already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const yearGroup = await yearGroupRepository.update(id, {
            name: data.name,
            academicYear: data.academicYear,
            createdBy: data.userId,
        });
        logger.info(`Year group updated in database with ID: ${id}`);
        return yearGroup;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Year group validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating year group with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the year group to be deleted
 * returns the deleted year group object
 */
const deleteYearGroup = async (id) => {
    try {
        const response = await yearGroupRepository.destroy(id);
        if (!response) {
            logger.warn(`No year group found for deletion with ID: ${id}`);
            throw {
                err: 'No year group record found for the id provided',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Year group deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting year group with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createYearGroup,
    getYearGroup,
    updateYearGroup,
    deleteYearGroup,
};
