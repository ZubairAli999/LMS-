const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const programService = require('../../service/academics/program-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Program
 * @route       POST /api/admins/programs
 * @access      Private Admin Only
 */
const createProgram = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating program for admin ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await programService.createProgram({ ...req.body, userId: userId });
        successResponseBody.message = 'Program created';
        successResponseBody.data = response;
        logger.info(`Program created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating program: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Programs
 * @route       GET /api/admins/programs
 * @access      Private Admin Only
 */
const getPrograms = async (req, res) => {
    try {
        logger.info('Fetching all programs');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all programs: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Program
 * @route       GET /api/admins/programs/:id
 * @access      Private Admin Only
 */
const getSingleProgram = async (req, res) => {
    try {
        logger.info(`Fetching program with ID: ${req.params.id}`);
        const response = await programService.getProgram(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Single Program fetched successfully';
        logger.info(`Program fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching program with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Program
 * @route       PUT /api/admins/programs/:id
 * @access      Private Admin Only
 */
const updateProgram = async (req, res) => {
    try {
        logger.info(`Updating program with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await programService.updateProgram(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Program updated successfully';
        logger.info(`Program updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating program with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Program
 * @route       DELETE /api/admins/programs/:id
 * @access      Private Admin Only
 */
const deleteProgram = async (req, res) => {
    try {
        logger.info(`Deleting program with ID: ${req.params.id}`);
        await programService.deleteProgram(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Program Deleted Successfully';
        logger.info(`Program deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting program with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createProgram,
    getPrograms,
    getSingleProgram,
    updateProgram,
    deleteProgram,
};
