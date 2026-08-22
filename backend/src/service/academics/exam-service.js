const ExamRepository = require('../../repository/academics/exam-repository');
const TeacherRepository = require('../../repository/staff/teacher-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const examRepository = new ExamRepository();
const teacherRepository = new TeacherRepository();

/**
 * data -> object containing details of the new exam to be created
 * returns the newly created exam object
 */
const createExam = async (data) => {
    try {
        const teacherFound = await teacherRepository.get(data.userId);
        if (!teacherFound) {
            logger.warn(`Teacher not found with ID: ${data.userId}`);
            throw {
                err: 'Teacher not found',
                code: STATUS.NOT_FOUND,
            };
        }
        const examExists = await examRepository.findByName(data.name);
        if (examExists) {
            logger.warn(`Exam already exists with name: ${data.name}`);
            throw {
                err: 'Exam already exists!',
                code: STATUS.BAD_REQUEST,
            };
        }
        const examCreated = await examRepository.create({
            name: data.name,
            description: data.description,
            academicTerm: data.academicTerm,
            academicYear: data.academicYear,
            duration: data.duration,
            examDate: data.examDate,
            examTime: data.examTime,
            examType: data.examType,
            classLevel: data.classLevel,
            createdBy: data.userId,
            subject: data.subject,
            program: data.program,
        });
        // push the exam into teacher
        await teacherRepository.pushToField(data.userId, 'examsCreated', examCreated._id);

        logger.info(`Exam created in database with ID: ${examCreated._id}`);
        return examCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Exam validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating exam: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the exam to be fetched
 * returns the exam object matching the id
 */
const getExam = async (id) => {
    const exam = await examRepository.get(id);
    if (!exam) {
        throw {
            err: 'No exam found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return exam;
};

/**
 * id   -> id used to identify the exam to be updated
 * data -> object containing the fields to update
 * returns the updated exam object
 */
const updateExam = async (id, data) => {
    try {
        const examFound = await examRepository.findByName(data.name);
        if (examFound) {
            logger.warn(`Exam already exists with name: ${data.name}`);
            throw {
                err: 'Exam already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const examUpdated = await examRepository.update(id, {
            name: data.name,
            description: data.description,
            subject: data.subject,
            program: data.program,
            academicTerm: data.academicTerm,
            duration: data.duration,
            examDate: data.examDate,
            examTime: data.examTime,
            classLevel: data.classLevel,
            examType: data.examType,
            academicYear: data.academicYear,
            createdBy: data.userId,
        });
        logger.info(`Exam updated in database with ID: ${id}`);
        return examUpdated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Exam validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating exam with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the exam to be deleted
 * returns the deleted exam object
 */
const deleteExam = async (id) => {
    try {
        const response = await examRepository.destroy(id);
        logger.info(`Exam deleted from database with ID: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting exam with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createExam,
    getExam,
    updateExam,
    deleteExam,
};
