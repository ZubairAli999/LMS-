/**
 * Integration tests for the Academic Term HTTP routes
 * (src/routes/academics/academicTerm.js), mounted at /api/v1/academic-terms.
 * Chain: isAuthenticated(Admin) + roleRestriction('admin').
 */
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/app/app');
const AcademicTerm = require('../../src/model/Academic/AcademicTerm');
const { createAdmin, createAcademicTerm } = require('../helpers');

const BASE = '/api/v1/academic-terms';
const JSON_TYPE = 'application/json';

describe('Academic Term integration', () => {
    describe('POST /', () => {
        it('creates a term with an admin token and persists it', async () => {
            const { token } = await createAdmin();

            const res = await request(app)
                .post(BASE)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', JSON_TYPE)
                .send({ name: 'Winter term', description: 'Cold season', duration: '3 months' });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeTruthy();
            expect(res.body.data.name).toBe('Winter term');

            const persisted = await AcademicTerm.findOne({ name: 'Winter term' });
            expect(persisted).not.toBeNull();
        });

        it('returns 401 without a token', async () => {
            const res = await request(app)
                .post(BASE)
                .set('Content-Type', JSON_TYPE)
                .send({ name: 'No Auth term', description: 'x', duration: '3 months' });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /:id', () => {
        it('returns the term with an admin token', async () => {
            const { admin, token } = await createAdmin();
            const term = await createAcademicTerm(admin._id, { name: 'Spring term' });

            const res = await request(app)
                .get(`${BASE}/${term._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(term._id.toString());
            expect(res.body.data.name).toBe('Spring term');
        });

        it('returns 404 for a nonexistent id', async () => {
            const { token } = await createAdmin();
            const missingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`${BASE}/${missingId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /', () => {
        it('returns 200 with a results payload for an admin', async () => {
            const { admin, token } = await createAdmin();
            await createAcademicTerm(admin._id, { name: 'Autumn term' });

            const res = await request(app)
                .get(BASE)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            // advancedResults middleware wraps the payload in res.results
            expect(res.body).toBeTruthy();
        });
    });

    describe('PUT /:id', () => {
        it('updates a term', async () => {
            const { admin, token } = await createAdmin();
            const term = await createAcademicTerm(admin._id, { name: 'Old name' });

            const res = await request(app)
                .put(`${BASE}/${term._id}`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', JSON_TYPE)
                .send({ name: 'New name', description: 'updated', duration: '4 months' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('New name');

            const persisted = await AcademicTerm.findById(term._id);
            expect(persisted.name).toBe('New name');
        });
    });

    describe('DELETE /:id', () => {
        it('deletes a term and a subsequent GET returns 404', async () => {
            const { admin, token } = await createAdmin();
            const term = await createAcademicTerm(admin._id, { name: 'Doomed term' });

            const delRes = await request(app)
                .delete(`${BASE}/${term._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(delRes.status).toBe(200);
            expect(delRes.body.success).toBe(true);

            const getRes = await request(app)
                .get(`${BASE}/${term._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(getRes.status).toBe(404);
        });
    });
});
