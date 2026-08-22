/**
 * Shared test helpers: factories for valid model documents and a JWT helper
 * that mirrors src/utils/generateToken.js (signs { id } with secret 'anykey').
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Admin = require('../src/model/Staff/Admin');
const Teacher = require('../src/model/Staff/Teacher');
const Student = require('../src/model/Academic/Student');
const AcademicTerm = require('../src/model/Academic/AcademicTerm');

/**
 * Sign a token exactly the way the app does, so it passes verifyToken.
 */
const signToken = (id) => jwt.sign({ id }, 'anykey', { expiresIn: '5d' });

/**
 * Hash a password the same way utils/helpers.hashPassword does.
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Create an admin document. Returns { admin, token, password }.
 */
const createAdmin = async (overrides = {}) => {
    const password = overrides.password || 'password123';
    const admin = await Admin.create({
        name: overrides.name || 'Test Admin',
        email: overrides.email || 'admin@test.com',
        password: await hashPassword(password),
        role: 'admin',
        ...stripAuthFields(overrides),
    });
    return { admin, token: signToken(admin._id), password };
};

/**
 * Create a teacher document. Returns { teacher, token, password }.
 */
const createTeacher = async (overrides = {}) => {
    const password = overrides.password || 'password123';
    const teacher = await Teacher.create({
        name: overrides.name || 'Test Teacher',
        email: overrides.email || 'teacher@test.com',
        password: await hashPassword(password),
        role: 'teacher',
        ...stripAuthFields(overrides),
    });
    return { teacher, token: signToken(teacher._id), password };
};

/**
 * Create a student document. Returns { student, token, password }.
 */
const createStudent = async (overrides = {}) => {
    const password = overrides.password || 'password123';
    const student = await Student.create({
        name: overrides.name || 'Test Student',
        email: overrides.email || 'student@test.com',
        password: await hashPassword(password),
        role: 'student',
        ...stripAuthFields(overrides),
    });
    return { student, token: signToken(student._id), password };
};

/**
 * Create an academic term document owned by the given admin id.
 */
const createAcademicTerm = async (adminId, overrides = {}) => {
    return AcademicTerm.create({
        name: overrides.name || '1st term',
        description: overrides.description || 'First term of the year',
        duration: overrides.duration || '3 months',
        createdBy: adminId,
        ...overrides,
    });
};

// Do not let name/email/password overrides leak in twice
function stripAuthFields(overrides) {
    const { name, email, password, ...rest } = overrides;
    return rest;
}

module.exports = {
    signToken,
    hashPassword,
    createAdmin,
    createTeacher,
    createStudent,
    createAcademicTerm,
};
