const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const examResultsService = require('../../service/academics/examResults-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Exam results check
 * @route       GET /api/v1/exam-results/:id/check
 * @access      Private Students Only
 */
const checkExamResults = async (req, res) => {
    try {
        logger.info(`Checking exam result ID: ${req.params.id} for student ID: ${req.userAuth._id}`);
        const { examResult, student } = await examResultsService.checkExamResults(
            req.userAuth._id,
            req.params.id
        );
        successResponseBody.message = 'Exam Results';
        successResponseBody.data = examResult;
        successResponseBody.student = student;
        logger.info(`Exam result fetched successfully for result ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error checking exam result with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get all exam results (name, id)
 * @route       GET /api/v1/exam-results
 * @access      Private Students Only
 */
const getExamResults = async (req, res) => {
    try {
        logger.info('Fetching all exam results');
        const response = await examResultsService.getExamResults();
        successResponseBody.data = response;
        successResponseBody.message = 'Exam results retrieved successfully';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching exam results: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin publish exam results
 * @route       PUT /api/v1/exam-results/:id/admin-toggle-publish
 * @access      Private Students Only
 */
const adminToggleExamResult = async (req, res) => {
    try {
        logger.info(`Toggling publish state for exam result ID: ${req.params.id}`);
        const response = await examResultsService.adminToggleExamResult(
            req.params.id,
            req.body.publish
        );
        successResponseBody.data = response;
        successResponseBody.message = 'Exam results Updated';
        logger.info(`Exam result publish state updated for ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating exam result with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    checkExamResults,
    getExamResults,
    adminToggleExamResult,
};
