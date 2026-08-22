/**
 * Integration tests for the Exam Results HTTP routes
 * (src/routes/academics/examResultsRoutes.js), mounted at /api/v1/exam-results.
 *
 * GET / and GET /:id/check    -> isStudentLogin + isStudent
 * PUT /:id/admin-toggle-publish -> isLogin + isAdmin
 */
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/app/app');
const ExamResult = require('../../src/model/Academic/ExamResults');
const { createStudent, createAdmin } = require('../helpers');

const BASE = '/api/v1/exam-results';
const JSON_TYPE = 'application/json';

/**
 * Build a valid ExamResult document directly (many refs are only stored, not
 * validated against real docs, so placeholder ObjectIds satisfy the schema).
 */
const buildExamResult = async (overrides = {}) =>
    ExamResult.create({
        studentID: overrides.studentID || 'STU123AB',
        exam: new mongoose.Types.ObjectId(),
        grade: 85,
        score: 85,
        status: 'Pass',
        remarks: 'Very Good',
        academicTerm: new mongoose.Types.ObjectId(),
        academicYear: new mongoose.Types.ObjectId(),
        ...overrides,
    });

describe('Exam Results integration', () => {
    describe('GET / (student only)', () => {
        it('returns 200 with a results array for a student token', async () => {
            const { token } = await createStudent();

            const res = await request(app)
                .get(BASE)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('returns 401 without a token', async () => {
            const res = await request(app).get(BASE);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /:id/check (student only)', () => {
        it('returns 404 for a nonexistent result id with a valid student token', async () => {
            const { token } = await createStudent();
            const missingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`${BASE}/${missingId}/check`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('returns 403 when a non-student (admin) token is used', async () => {
            // isStudentLogin looks the token up in the Student collection; an
            // admin id won't be found there, so isStudent denies with 403.
            const { token } = await createAdmin();
            const missingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`${BASE}/${missingId}/check`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /:id/admin-toggle-publish (admin only)', () => {
        it('publishes an existing result with an admin token', async () => {
            const { token } = await createAdmin();
            const result = await buildExamResult({ isPublished: false });

            const res = await request(app)
                .put(`${BASE}/${result._id}/admin-toggle-publish`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', JSON_TYPE)
                .send({ publish: true });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.isPublished).toBe(true);

            const persisted = await ExamResult.findById(result._id);
            expect(persisted.isPublished).toBe(true);
        });

        it('returns 404 when toggling a nonexistent result', async () => {
            const { token } = await createAdmin();
            const missingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`${BASE}/${missingId}/admin-toggle-publish`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', JSON_TYPE)
                .send({ publish: true });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('returns 403 when a student token is used', async () => {
            const { token } = await createStudent();
            const result = await buildExamResult();

            const res = await request(app)
                .put(`${BASE}/${result._id}/admin-toggle-publish`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', JSON_TYPE)
                .send({ publish: true });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});
