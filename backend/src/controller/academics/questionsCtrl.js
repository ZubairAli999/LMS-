const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const questionService = require('../../service/academics/question-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Question
 * @route       POST /api/v1/questions/:examID
 * @access      Private Teachers Only
 */
const createQuestion = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating question for exam ID: ${req.params.examID}, data: ${JSON.stringify(req.body)}`);
        const response = await questionService.createQuestion(req.params.examID, {
            ...req.body,
            userId: userId,
        });
        successResponseBody.message = 'Question created';
        successResponseBody.data = response;
        logger.info(`Question created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating question: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get all questions
 * @route       GET /api/v1/questions/
 * @access      Private Teachers Only
 */
const getQuestions = async (req, res) => {
    try {
        logger.info('Fetching all questions');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all questions: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get single question
 * @route       GET /api/v1/questions/:id
 * @access      Private Teachers Only
 */
const getQuestion = async (req, res) => {
    try {
        logger.info(`Fetching question with ID: ${req.params.id}`);
        const response = await questionService.getQuestion(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Question fetched successfully';
        logger.info(`Question fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching question with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Question
 * @route       PUT /api/v1/questions/:id
 * @access      Private Teachers Only
 */
const updateQuestion = async (req, res) => {
    try {
        logger.info(`Updating question with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await questionService.updateQuestion(req.params.id, { ...req.body });
        successResponseBody.data = response;
        successResponseBody.message = 'Question update successfully';
        logger.info(`Question updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating question with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
};
