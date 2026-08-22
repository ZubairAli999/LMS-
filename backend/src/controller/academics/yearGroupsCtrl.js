const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const yearGroupService = require('../../service/academics/yearGroup-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Year Group
 * @route       POST /api/admins/year-groups
 * @access      Private Admin Only
 */
const createYearGroup = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating year group for admin ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await yearGroupService.createYearGroup({ ...req.body, userId: userId });
        successResponseBody.message = 'Year Group created';
        successResponseBody.data = response;
        logger.info(`Year group created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating year group: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Year Groups
 * @route       GET /api/admins/year-groups
 * @access      Private Admin Only
 */
const getYearGroups = async (req, res) => {
    try {
        logger.info('Fetching all year groups');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all year groups: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Year Group
 * @route       GET /api/admins/year-groups/:id
 * @access      Private Admin Only
 */
const getYearGroup = async (req, res) => {
    try {
        logger.info(`Fetching year group with ID: ${req.params.id}`);
        const response = await yearGroupService.getYearGroup(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Single Year Group fetched successfully';
        logger.info(`Year group fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching year group with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Year Group
 * @route       PUT /api/admins/year-groups/:id
 * @access      Private Admin Only
 */
const updateYearGroup = async (req, res) => {
    try {
        logger.info(`Updating year group with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await yearGroupService.updateYearGroup(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Year Group updated successfully';
        logger.info(`Year group updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating year group with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Year Group
 * @route       DELETE /api/admins/year-groups/:id
 * @access      Private Admin Only
 */
const deleteYearGroup = async (req, res) => {
    try {
        logger.info(`Deleting year group with ID: ${req.params.id}`);
        await yearGroupService.deleteYearGroup(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Year Group Deleted Successfully';
        logger.info(`Year group deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting year group with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createYearGroup,
    getYearGroups,
    getYearGroup,
    updateYearGroup,
    deleteYearGroup,
};
