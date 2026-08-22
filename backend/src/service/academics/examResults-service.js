const ExamResultsRepository = require('../../repository/academics/examResults-repository');
const StudentRepository = require('../../repository/academics/student-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const examResultsRepository = new ExamResultsRepository();
const studentRepository = new StudentRepository();

/**
 * studentAuthId -> authenticated student id used to locate the student record
 * resultId      -> id of the exam result to be checked
 * returns an object containing the exam result and the student
 */
const checkExamResults = async (studentAuthId, resultId) => {
    const studentFound = await studentRepository.get(studentAuthId);
    if (!studentFound) {
        logger.warn(`No student found with ID: ${studentAuthId}`);
        throw {
            err: 'No student found',
            code: STATUS.NOT_FOUND,
        };
    }
    const examResult = await examResultsRepository.findPublishedForStudent(
        studentFound.studentId,
        resultId
    );
    if (!examResult) {
        logger.warn(`Exam results not found for result ID: ${resultId}`);
        throw {
            err: 'Exam results not found',
            code: STATUS.NOT_FOUND,
        };
    }
    // check if exam is published
    if (examResult.isPublished === false) {
        logger.warn(`Exam results not published for result ID: ${resultId}`);
        throw {
            err: 'Exam results is not available, check out later',
            code: STATUS.FORBIDDEN,
        };
    }
    logger.info(`Exam result checked for result ID: ${resultId}`);
    return { examResult, student: studentFound };
};

/**
 * returns all exam results with only the exam field selected and populated
 */
const getExamResults = async () => {
    const results = await examResultsRepository.getAllWithExam();
    logger.info('Fetched all exam results');
    return results;
};

/**
 * resultId -> id of the exam result to toggle publish state
 * publish  -> the new isPublished value
 * returns the updated exam result object
 */
const adminToggleExamResult = async (resultId, publish) => {
    const examResult = await examResultsRepository.get(resultId);
    if (!examResult) {
        logger.warn(`Exam result not found with ID: ${resultId}`);
        throw {
            err: 'Exam result not found',
            code: STATUS.NOT_FOUND,
        };
    }
    const publishResult = await examResultsRepository.update(resultId, {
        isPublished: publish,
    });
    logger.info(`Exam result publish state updated for ID: ${resultId}`);
    return publishResult;
};

module.exports = {
    checkExamResults,
    getExamResults,
    adminToggleExamResult,
};
