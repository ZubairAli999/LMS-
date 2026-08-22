const CrudRepository = require('../crud-repository');
const Question = require('../../model/Academic/Questions');

/**
 * Data-access layer for the Question model.
 * Inherits the generic CRUD methods and adds Question-specific queries.
 */
class QuestionRepository extends CrudRepository {
    constructor() {
        super(Question);
    }

    /**
     * question -> the question text to search by
     * returns the question matching the text (or null)
     */
    async findByQuestion(question) {
        const questionFound = await this.model.findOne({ question });
        return questionFound;
    }
}

module.exports = QuestionRepository;
