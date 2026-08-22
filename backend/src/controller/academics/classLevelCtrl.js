const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const classLevelService = require('../../service/academics/classLevel-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Class Level
 * @route       POST /api/admins/class-levels
 * @access      Private Admin Only
 */
const createClassLevel = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating class level for admin ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await classLevelService.createClassLevel({ ...req.body, userId: userId });
        successResponseBody.message = 'Class Level Created';
        successResponseBody.data = response;
        logger.info(`Class level created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating class level: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Class Levels
 * @route       GET /api/admins/class-levels
 * @access      Private Admin Only
 */
const getClassLevels = async (req, res) => {
    try {
        logger.info('Fetching all class levels');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all class levels: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Class Level
 * @route       GET /api/admins/class-levels/:id
 * @access      Private Admin Only
 */
const getClassLevel = async (req, res) => {
    try {
        logger.info(`Fetching class level with ID: ${req.params.id}`);
        const response = await classLevelService.getClassLevel(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Class Level fetched successfully';
        logger.info(`Class level fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching class level with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Single Class Level
 * @route       PUT /api/admins/class-levels/:id
 * @access      Private Admin Only
 */
const updateClassLevel = async (req, res) => {
    try {
        logger.info(`Updating class level with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await classLevelService.updateClassLevel(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Class Level updated successfully';
        logger.info(`Class level updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating class level with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Class Level
 * @route       DELETE /api/admins/class-levels/:id
 * @access      Private Admin Only
 */
const deleteClassLevel = async (req, res) => {
    try {
        logger.info(`Deleting class level with ID: ${req.params.id}`);
        await classLevelService.deleteClassLevel(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Class Level Deleted Successfully';
        logger.info(`Class level deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting class level with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createClassLevel,
    getClassLevels,
    getClassLevel,
    updateClassLevel,
    deleteClassLevel,
};
