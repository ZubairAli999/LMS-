const CrudRepository = require('../crud-repository');
const AcademicTerm = require('../../model/Academic/AcademicTerm');

/**
 * Data-access layer for the AcademicTerm model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds any AcademicTerm-specific queries.
 */
class AcademicTermRepository extends CrudRepository {
    constructor() {
        super(AcademicTerm);
    }

    /**
     * name -> the name to search an academic term by
     * returns the academic term matching the name (or null)
     */
    async findByName(name) {
        const academicTerm = await this.model.findOne({ name });
        return academicTerm;
    }
}

module.exports = AcademicTermRepository;
