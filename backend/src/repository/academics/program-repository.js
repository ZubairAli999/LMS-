const CrudRepository = require('../crud-repository');
const Program = require('../../model/Academic/Program');

/**
 * Data-access layer for the Program model.
 * Inherits create/get/getAll/getOne/update/destroy from CrudRepository and
 * adds Program-specific queries such as name lookup and pushing related ids
 * onto the program.
 */
class ProgramRepository extends CrudRepository {
    constructor() {
        super(Program);
    }

    /**
     * name -> the name to search a program by
     * returns the program matching the name (or null)
     */
    async findByName(name) {
        const program = await this.model.findOne({ name });
        return program;
    }

    /**
     * id    -> the program to push onto
     * field -> the array field name on the program (e.g. 'subjects')
     * value -> the id/value to push into that array
     * returns the saved program document
     */
    async pushToField(id, field, value) {
        const program = await this.model.findById(id);
        if (!program) {
            return null;
        }
        program[field].push(value);
        await program.save();
        return program;
    }
}

module.exports = ProgramRepository;
