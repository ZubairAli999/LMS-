const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const academicTermService = require('../../service/academics/academicTerm-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Academic Term
 * @route       POST /api/v1/academic-terms
 * @access      Private Admin Only
 */
const createAcademicTerm = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating academic term for admin ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await academicTermService.createAcademicTerm({ ...req.body, userId: userId });
        successResponseBody.message = 'Academic term created';
        successResponseBody.data = response;
        logger.info(`Academic term created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating academic term: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Academic Terms
 * @route       GET /api/v1/academic-terms
 * @access      Private Admin Only
 */
const getAcademicTerms = async (req, res) => {
    try {
        logger.info('Fetching all academic terms');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all academic terms: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Academic Term
 * @route       GET /api/v1/academic-terms/:id
 * @access      Private Admin Only
 */
const getAcademicTerm = async (req, res) => {
    try {
        logger.info(`Fetching academic term with ID: ${req.params.id}`);
        const response = await academicTermService.getAcademicTerm(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Academic term fetched successfully';
        logger.info(`Academic term fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching academic term with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Academic Term
 * @route       PUT /api/v1/academic-terms/:id
 * @access      Private Admin Only
 */
const updateAcademicTerm = async (req, res) => {
    try {
        logger.info(`Updating academic term with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await academicTermService.updateAcademicTerm(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Academic term updated successfully';
        logger.info(`Academic term updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating academic term with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Academic Term
 * @route       DELETE /api/v1/academic-terms/:id
 * @access      Private Admin Only
 */
const deleteAcademicTerm = async (req, res) => {
    try {
        logger.info(`Deleting academic term with ID: ${req.params.id}`);
        await academicTermService.deleteAcademicTerm(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Academic term deleted successfully';
        logger.info(`Academic term deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting academic term with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createAcademicTerm,
    getAcademicTerms,
    getAcademicTerm,
    updateAcademicTerm,
    deleteAcademicTerm,
};
