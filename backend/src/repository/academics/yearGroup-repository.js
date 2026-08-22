const CrudRepository = require('../crud-repository');
const YearGroup = require('../../model/Academic/YearGroup');

/**
 * Data-access layer for the YearGroup model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds any YearGroup-specific queries.
 */
class YearGroupRepository extends CrudRepository {
    constructor() {
        super(YearGroup);
    }

    /**
     * name -> the name to search a year group by
     * returns the year group matching the name (or null)
     */
    async findByName(name) {
        const yearGroup = await this.model.findOne({ name });
        return yearGroup;
    }
}

module.exports = YearGroupRepository;
