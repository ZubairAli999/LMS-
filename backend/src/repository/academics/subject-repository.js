const CrudRepository = require('../crud-repository');
const Subject = require('../../model/Academic/Subject');

/**
 * Data-access layer for the Subject model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds any Subject-specific queries.
 */
class SubjectRepository extends CrudRepository {
    constructor() {
        super(Subject);
    }

    /**
     * name -> the name to search a subject by
     * returns the subject matching the name (or null)
     */
    async findByName(name) {
        const subject = await this.model.findOne({ name });
        return subject;
    }
}

module.exports = SubjectRepository;
