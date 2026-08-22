const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const academicYearService = require('../../service/academics/academicYear-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Academic Year
 * @route       POST /api/admins/academic-years
 * @access      Private Admin Only
 */
const createAcademicYear = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating academic year for admin ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await academicYearService.createAcademicYear({ ...req.body, userId: userId });
        successResponseBody.message = 'Academic year created';
        successResponseBody.data = response;
        logger.info(`Academic year created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating academic year: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Academic Years
 * @route       GET /api/admins/academic-years
 * @access      Private Admin Only
 */
const getAcademicYears = async (req, res) => {
    try {
        logger.info('Fetching all academic years');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all academic years: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Academic Year
 * @route       GET /api/admins/academic-years/:id
 * @access      Private Admin Only
 */
const getAcademicYear = async (req, res) => {
    try {
        logger.info(`Fetching academic year with ID: ${req.params.id}`);
        const response = await academicYearService.getAcademicYear(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Academic year fetched successfully';
        logger.info(`Academic year fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching academic year with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Academic Year
 * @route       PUT /api/admins/academic-years/:id
 * @access      Private Admin Only
 */
const updateAcademicYear = async (req, res) => {
    try {
        logger.info(`Updating academic year with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await academicYearService.updateAcademicYear(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Academic year updated successfully';
        logger.info(`Academic year updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating academic year with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Academic Year
 * @route       DELETE /api/admins/academic-years/:id
 * @access      Private Admin Only
 */
const deleteAcademicYear = async (req, res) => {
    try {
        logger.info(`Deleting academic year with ID: ${req.params.id}`);
        await academicYearService.deleteAcademicYear(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Academic year deleted successfully';
        logger.info(`Academic year deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting academic year with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createAcademicYear,
    getAcademicYears,
    getAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
};
