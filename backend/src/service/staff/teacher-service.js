const TeacherRepository = require('../../repository/staff/teacher-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { STATUS } = require('../../utils/constants');
const { hashPassword, isPassMatched } = require('../../utils/helpers');
const generateToken = require('../../utils/generateToken');
const logger = require('../../config/logger');

const teacherRepository = new TeacherRepository();
const adminRepository = new AdminRepository();

/**
 * data -> object containing name, email, password and the registering admin's userId
 * returns the newly created teacher object
 */
const registerTeacher = async (data) => {
    try {
        const adminFound = await adminRepository.get(data.userId);
        if (!adminFound) {
            logger.warn(`Teacher registration failed, admin not found for id: ${data.userId}`);
            throw {
                err: 'Admin not found',
                code: STATUS.NOT_FOUND,
            };
        }
        const teacher = await teacherRepository.findByEmail(data.email);
        if (teacher) {
            logger.warn(`Teacher already employed with email: ${data.email}`);
            throw {
                err: 'Teacher already employed',
                code: STATUS.BAD_REQUEST,
            };
        }
        const hashedPassword = await hashPassword(data.password);
        const teacherCreated = await teacherRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        await adminRepository.pushToField(data.userId, 'teachers', teacherCreated?._id);
        logger.info(`Teacher created in database with ID: ${teacherCreated._id}`);
        return teacherCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Teacher validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error registering teacher: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * data -> object containing email and password credentials
 * returns { token } on successful authentication, otherwise null
 */
const loginTeacher = async (data) => {
    const teacher = await teacherRepository.findByEmail(data.email);
    if (!teacher) {
        logger.warn(`Teacher login failed, no user found for email: ${data.email}`);
        return null;
    }
    const isMatched = await isPassMatched(data.password, teacher?.password);
    if (!isMatched) {
        logger.warn(`Teacher login failed, password mismatch for email: ${data.email}`);
        return null;
    }
    logger.info(`Teacher logged in with ID: ${teacher._id}`);
    return { token: generateToken(teacher?._id) };
};

/**
 * id -> id used to identify the teacher to be fetched
 * returns the teacher object matching the id
 */
const getTeacherByAdmin = async (id) => {
    const teacher = await teacherRepository.get(id);
    if (!teacher) {
        logger.warn(`No teacher found for the id provided: ${id}`);
        throw {
            err: 'Teacher not found',
            code: STATUS.NOT_FOUND,
        };
    }
    return teacher;
};

/**
 * id -> id used to identify the teacher whose profile is to be fetched
 * returns the teacher profile object
 */
const getTeacherProfile = async (id) => {
    const teacher = await teacherRepository.getProfile(id);
    if (!teacher) {
        logger.warn(`No teacher found for the id provided: ${id}`);
        throw {
            err: 'Teacher not found',
            code: STATUS.NOT_FOUND,
        };
    }
    return teacher;
};

/**
 * id   -> id used to identify the teacher to be updated
 * data -> object containing the fields to update (email, name, password)
 * returns the updated teacher object
 */
const updateTeacherProfile = async (id, data) => {
    try {
        const emailExists = await teacherRepository.findByEmail(data.email);
        if (emailExists) {
            logger.warn(`Teacher update failed, email already exists: ${data.email}`);
            throw {
                err: 'This email already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        let teacher;
        if (data.password) {
            teacher = await teacherRepository.update(id, {
                email: data.email,
                password: await hashPassword(data.password),
                name: data.name,
            });
        } else {
            teacher = await teacherRepository.update(id, {
                email: data.email,
                name: data.name,
            });
        }
        logger.info(`Teacher profile updated in database with ID: ${id}`);
        return teacher;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Teacher validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating teacher with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * teacherID -> id used to identify the teacher to be updated by an admin
 * data      -> object containing optional program, classLevel, academicYear, subject
 * returns { teacher, message } reflecting the last field assigned
 */
const adminUpdateTeacher = async (teacherID, data) => {
    const teacherFound = await teacherRepository.get(teacherID);
    if (!teacherFound) {
        logger.warn(`Admin update teacher failed, teacher not found for id: ${teacherID}`);
        throw {
            err: 'Teacher Not found',
            code: STATUS.NOT_FOUND,
        };
    }
    if (teacherFound.isWithdrawn) {
        logger.warn(`Admin update teacher denied, teacher is withdrawn with id: ${teacherID}`);
        throw {
            err: 'Action denied, teacher is withdrawn',
            code: STATUS.BAD_REQUEST,
        };
    }

    let message = 'Teacher profile updated successfully';

    if (data.program) {
        teacherFound.program = data.program;
        await teacherFound.save();
        message = 'Teacher profile updated successfully';
    }

    if (data.classLevel) {
        teacherFound.classLevel = data.classLevel;
        await teacherFound.save();
        message = 'Teacher profile updated successfully';
    }

    if (data.academicYear) {
        teacherFound.academicYear = data.academicYear;
        await teacherFound.save();
        message = 'Teacher profile updated successfully';
    }

    if (data.subject) {
        teacherFound.subject = data.subject;
        await teacherFound.save();
        message = 'Teacher subject updated successfully';
    }

    logger.info(`Teacher updated by admin with ID: ${teacherID}`);
    return { teacher: teacherFound, message: message };
};

module.exports = {
    registerTeacher,
    loginTeacher,
    getTeacherByAdmin,
    getTeacherProfile,
    updateTeacherProfile,
    adminUpdateTeacher,
};
