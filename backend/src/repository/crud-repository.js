const logger = require('../config/logger');

/**
 * Generic CRUD repository. Every model-specific repository extends this class
 * and passes its Mongoose model to the constructor, inheriting the common
 * create/get/getAll/update/destroy data-access methods.
 *
 * Repositories are the ONLY layer that talks to the Mongoose models directly.
 * Services depend on repositories, never on the models.
 */
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    /**
     * data -> object containing details of the document to create
     * returns the newly created document
     */
    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            logger.error(`Repository error in create for ${this.model.modelName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * id -> id used to identify the document to fetch
     * returns the matching document (or null)
     */
    async get(id) {
        try {
            const response = await this.model.findById(id);
            return response;
        } catch (error) {
            logger.error(`Repository error in get for ${this.model.modelName} with ID ${id}: ${error.message}`);
            throw error;
        }
    }

    /**
     * filter -> optional query object used to filter documents
     * returns all documents matching the filter (defaults to every document)
     */
    async getAll(filter = {}) {
        try {
            const response = await this.model.find(filter);
            return response;
        } catch (error) {
            logger.error(`Repository error in getAll for ${this.model.modelName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * filter -> query object identifying a single document
     * returns the first document matching the filter (or null)
     */
    async getOne(filter) {
        try {
            const response = await this.model.findOne(filter);
            return response;
        } catch (error) {
            logger.error(`Repository error in getOne for ${this.model.modelName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * id   -> id used to identify the document to update
     * data -> object containing the fields to update
     * returns the updated document
     */
    async update(id, data) {
        try {
            const response = await this.model.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });
            return response;
        } catch (error) {
            logger.error(`Repository error in update for ${this.model.modelName} with ID ${id}: ${error.message}`);
            throw error;
        }
    }

    /**
     * id -> id used to identify the document to delete
     * returns the deleted document (or null)
     */
    async destroy(id) {
        try {
            const response = await this.model.findByIdAndDelete(id);
            return response;
        } catch (error) {
            logger.error(`Repository error in destroy for ${this.model.modelName} with ID ${id}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = CrudRepository;
