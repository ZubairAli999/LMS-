/**
 * Per-suite test setup (setupFilesAfterEach).
 *
 * Connects each test suite to the SINGLE shared in-memory MongoDB started by
 * globalSetup.js (via process.env.MONGO_TEST_URI), registers every Mongoose
 * model up-front so `.populate()` never throws MissingSchemaError, wipes all
 * collections between tests, and disconnects when the suite finishes.
 */
const mongoose = require('mongoose');

// Register ALL models once so cross-model populate() calls resolve their refs.
require('../src/model/Staff/Admin');
require('../src/model/Staff/Teacher');
require('../src/model/Academic/Student');
require('../src/model/Academic/AcademicTerm');
require('../src/model/Academic/AcademicYear');
require('../src/model/Academic/ClassLevel');
require('../src/model/Academic/Program');
require('../src/model/Academic/Subject');
require('../src/model/Academic/YearGroup');
require('../src/model/Academic/Exam');
require('../src/model/Academic/Questions');
require('../src/model/Academic/ExamResults');

beforeAll(async () => {
    const uri = process.env.MONGO_TEST_URI;
    await mongoose.connect(uri);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});
