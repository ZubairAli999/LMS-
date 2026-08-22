/**
 * Integration tests for the Admin HTTP routes (src/routes/staff/adminRouter.js),
 * mounted at /api/v1/admins. Full HTTP round trips via supertest against the
 * in-memory Mongo DB set up by test/setup.js.
 *
 * NOTE: every request that carries a JSON body sets the Content-Type header
 * explicitly. This sidesteps a broken `mime.getType` in the pinned superagent
 * dependency under this repo's Jest module resolution (see final report notes);
 * the header being pre-set stops superagent from calling mime.getType('json').
 */
const request = require('supertest');

const app = require('../../src/app/app');
const Admin = require('../../src/model/Staff/Admin');
const { createAdmin } = require('../helpers');

const BASE = '/api/v1/admins';
const JSON_TYPE = 'application/json';

describe('Admin integration', () => {
    describe('POST /register', () => {
        it('registers a new admin and persists it', async () => {
            const res = await request(app)
                .post(`${BASE}/register`)
                .set('Content-Type', JSON_TYPE)
                .send({ name: 'Reg Admin', email: 'reg@test.com', password: 'password123' });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeTruthy();
            expect(res.body.data.email).toBe('reg@test.com');

            const persisted = await Admin.findOne({ email: 'reg@test.com' });
            expect(persisted).not.toBeNull();
            expect(persisted.name).toBe('Reg Admin');
            // password should be hashed, not stored in plaintext
            expect(persisted.password).not.toBe('password123');
        });

        it('rejects a duplicate email with 401 and an error message', async () => {
            await createAdmin({ email: 'dup@test.com' });

            const res = await request(app)
                .post(`${BASE}/register`)
                .set('Content-Type', JSON_TYPE)
                .send({ name: 'Dup Admin', email: 'dup@test.com', password: 'password123' });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.err).toBe('Email is already registered');
        });
    });

    describe('POST /login', () => {
        it('logs in with correct credentials and returns a token', async () => {
            await createAdmin({ email: 'login@test.com', password: 'password123' });

            const res = await request(app)
                .post(`${BASE}/login`)
                .set('Content-Type', JSON_TYPE)
                .send({ email: 'login@test.com', password: 'password123' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            // token string lives in body.data
            expect(typeof res.body.data).toBe('string');
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('returns 200 with an invalid-credentials message on wrong password', async () => {
            await createAdmin({ email: 'wrongpw@test.com', password: 'password123' });

            const res = await request(app)
                .post(`${BASE}/login`)
                .set('Content-Type', JSON_TYPE)
                .send({ email: 'wrongpw@test.com', password: 'notthepassword' });

            // controller responds 200 OK with success:true but empty data + message
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({});
            expect(res.body.message).toMatch(/invalid login credentials/i);
        });
    });

    describe('GET /profile', () => {
        it('returns the admin profile with a valid bearer token', async () => {
            const { admin, token } = await createAdmin({ email: 'profile@test.com' });

            const res = await request(app)
                .get(`${BASE}/profile`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeTruthy();
            expect(res.body.data._id).toBe(admin._id.toString());
            expect(res.body.data.email).toBe('profile@test.com');
        });

        it('returns 401 when no token is supplied', async () => {
            const res = await request(app).get(`${BASE}/profile`);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
