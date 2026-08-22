const CrudRepository = require('../crud-repository');
const ClassLevel = require('../../model/Academic/ClassLevel');

/**
 * Data-access layer for the ClassLevel model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds any ClassLevel-specific queries.
 */
class ClassLevelRepository extends CrudRepository {
    constructor() {
        super(ClassLevel);
    }

    /**
     * name -> the name to search a class level by
     * returns the class level matching the name (or null)
     */
    async findByName(name) {
        const classLevel = await this.model.findOne({ name });
        return classLevel;
    }
}

module.exports = ClassLevelRepository;
