const QuestionRepository = require('../../repository/academics/question-repository');
const ExamRepository = require('../../repository/academics/exam-repository');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const questionRepository = new QuestionRepository();
const examRepository = new ExamRepository();

/**
 * examID -> id of the exam the question belongs to
 * data   -> object containing details of the new question to be created
 * returns the newly created question object
 */
const createQuestion = async (examID, data) => {
    try {
        const examFound = await examRepository.get(examID);
        if (!examFound) {
            logger.warn(`Exam not found with ID: ${examID}`);
            throw {
                err: 'Exam not found',
                code: STATUS.NOT_FOUND,
            };
        }
        const questionExists = await questionRepository.findByQuestion(data.question);
        if (questionExists) {
            logger.warn(`Question already exists: ${data.question}`);
            throw {
                err: 'Question already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        const questionCreated = await questionRepository.create({
            question: data.question,
            optionA: data.optionA,
            optionB: data.optionB,
            optionC: data.optionC,
            optionD: data.optionD,
            correctAnswer: data.correctAnswer,
            createdBy: data.userId,
        });
        // add the question into the exam
        await examRepository.pushToField(examID, 'questions', questionCreated._id);

        logger.info(`Question created in database with ID: ${questionCreated._id}`);
        return questionCreated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Question validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error creating question: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * id -> id used to identify the question to be fetched
 * returns the question object matching the id
 */
const getQuestion = async (id) => {
    const question = await questionRepository.get(id);
    if (!question) {
        throw {
            err: 'No question found for the corresponding id provided',
            code: STATUS.NOT_FOUND,
        };
    }
    return question;
};

/**
 * id   -> id used to identify the question to be updated
 * data -> object containing the fields to update
 * returns the updated question object
 */
const updateQuestion = async (id, data) => {
    try {
        const updatedQuestion = await questionRepository.update(id, {
            question: data.question,
            optionA: data.optionA,
            optionB: data.optionB,
            optionC: data.optionC,
            optionD: data.optionD,
            correctAnswer: data.correctAnswer,
        });
        logger.info(`Question updated in database with ID: ${id}`);
        return updatedQuestion;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Question validation error during update with ID ${id}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating question with ID ${id}: ${error.err || error.message}`);
        throw error;
    }
};

module.exports = {
    createQuestion,
    getQuestion,
    updateQuestion,
};
