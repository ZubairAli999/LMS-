const CrudRepository = require('../crud-repository');
const AcademicYear = require('../../model/Academic/AcademicYear');

/**
 * Data-access layer for the AcademicYear model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds any AcademicYear-specific queries.
 */
class AcademicYearRepository extends CrudRepository {
    constructor() {
        super(AcademicYear);
    }

    /**
     * name -> the name to search an academic year by
     * returns the academic year matching the name (or null)
     */
    async findByName(name) {
        const academicYear = await this.model.findOne({ name });
        return academicYear;
    }
}

module.exports = AcademicYearRepository;
