const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const { hashPassword, isPassMatched } = require('../../utils/helpers');
const generateToken = require('../../utils/generateToken');
const logger = require('../../config/logger');

const adminRepository = new AdminRepository();

/**
 * data -> object containing name, email and password of the admin to register
 * returns the newly created admin object
 */
const registerAdmin = async (data) => {
    try {
        const adminFound = await adminRepository.findByEmail(data.email);
        if (adminFound) {
            logger.warn(`Admin already exists with email: ${data.email}`);
            throw {
                err: 'Email is already registered',
                code: STATUS.UNAUTHORISED,
            };
        }
        const user = await adminRepository.create({
            name: data.name,
            email: data.email,
            password: await hashPassword(data.password),
        });
        logger.info(`Admin created in database with ID: ${user._id}`);
        return user;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Admin validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error registering admin: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * data -> object containing email and password credentials
 * returns { token } on successful authentication, otherwise null
 */
const loginAdmin = async (data) => {
    const user = await adminRepository.findByEmail(data.email);
    if (!user) {
        logger.warn(`Admin login failed, no user found for email: ${data.email}`);
        return null;
    }
    const isMatched = await isPassMatched(data.password, user.password);
    if (!isMatched) {
        logger.warn(`Admin login failed, password mismatch for email: ${data.email}`);
        return null;
    }
    logger.info(`Admin logged in with ID: ${user._id}`);
    return { token: generateToken(user._id) };
};

/**
 * id -> id used to identify the admin whose profile is to be fetched
 * returns the admin profile object
 */
const getAdminProfile = async (id) => {
    const admin = await adminRepository.getProfile(id);

    if (!admin) {
        logger.warn(`No admin found for the id provided: ${id}`);
        throw {
            err: 'Admin not found',
            code: STATUS.NOT_FOUND,
        };
    }
    return admin;
};

/**
 * id   -> id used to identify the admin to be updated
 * data -> object containing the fields to update (email, name, password)
 * returns the updated admin object
 */
const updateAdmin = async (id, data) => {
    try {
        const emailExists = await adminRepository.findByEmail(data.email);
        if (emailExists) {
            logger.warn(`Admin update failed, email already exists: ${data.email}`);
            throw {
                err: 'This email already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        let admin;
        if (data.password) {
            admin = await adminRepository.update(id, {
                email: data.email,
                password: await hashPassword(data.password),
                name: data.name,
            });
        } else {
            admin = await adminRepository.update(id, {
                email: data.email,
                name: data.name,
            });
        }
        logger.info(`Admin updated in database with ID: ${id}`);
        return admin;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Admin validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating admin with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdmin,
};
