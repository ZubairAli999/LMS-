const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const subjectService = require('../../service/academics/subject-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Subject
 * @route       POST /api/admins/subjects/:programID
 * @access      Private Admin Only
 */
const createSubject = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating subject for admin ID: ${userId}, program ID: ${req.params.programID}, data: ${JSON.stringify(req.body)}`);
        const response = await subjectService.createSubject({
            ...req.body,
            programID: req.params.programID,
            userId: userId,
        });
        successResponseBody.message = 'Subject created';
        successResponseBody.data = response;
        logger.info(`Subject created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating subject: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Subjects
 * @route       GET /api/admins/subjects
 * @access      Private Admin Only
 */
const getSubjects = async (req, res) => {
    try {
        logger.info('Fetching all subjects');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all subjects: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Subject
 * @route       GET /api/admins/subjects/:id
 * @access      Private Admin Only
 */
const getSubject = async (req, res) => {
    try {
        logger.info(`Fetching subject with ID: ${req.params.id}`);
        const response = await subjectService.getSubject(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Single Subject fetched successfully';
        logger.info(`Subject fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching subject with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Subject
 * @route       PUT /api/admins/subjects/:id
 * @access      Private Admin Only
 */
const updateSubject = async (req, res) => {
    try {
        logger.info(`Updating subject with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await subjectService.updateSubject(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Subject updated successfully';
        logger.info(`Subject updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating subject with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Subject
 * @route       DELETE /api/admins/subjects/:id
 * @access      Private Admin Only
 */
const deleteSubject = async (req, res) => {
    try {
        logger.info(`Deleting subject with ID: ${req.params.id}`);
        await subjectService.deleteSubject(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Subject Deleted Successfully';
        logger.info(`Subject deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting subject with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject,
};
