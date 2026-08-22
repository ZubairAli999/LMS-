const mongoose = require('mongoose');

const adminService = require('../../../src/service/staff/admin-service');
const Admin = require('../../../src/model/Staff/Admin');
// getAdminProfile populates related refs, so those models must be registered
// with Mongoose (importing them triggers registration).
require('../../../src/model/Academic/AcademicYear');
require('../../../src/model/Academic/AcademicTerm');
require('../../../src/model/Academic/Program');
require('../../../src/model/Academic/YearGroup');
require('../../../src/model/Academic/ClassLevel');
require('../../../src/model/Staff/Teacher');
require('../../../src/model/Academic/Student');
const { createAdmin } = require('../../helpers');

describe('admin-service', () => {
    describe('registerAdmin', () => {
        it('creates an admin, hashes the password and returns the user', async () => {
            const user = await adminService.registerAdmin({
                name: 'New Admin',
                email: 'newadmin@test.com',
                password: 'plaintextpw',
            });

            expect(user).toBeTruthy();
            expect(user.email).toBe('newadmin@test.com');
            expect(user.name).toBe('New Admin');
            // password must be hashed, not stored in plaintext
            expect(user.password).toBeDefined();
            expect(user.password).not.toBe('plaintextpw');

            // confirm persisted
            const stored = await Admin.findById(user._id);
            expect(stored).toBeTruthy();
            expect(stored.password).not.toBe('plaintextpw');
        });

        it('rejects with 401 (UNAUTHORISED) when the email already exists', async () => {
            await adminService.registerAdmin({
                name: 'First',
                email: 'dupe@test.com',
                password: 'pw123456',
            });

            await expect(
                adminService.registerAdmin({
                    name: 'Second',
                    email: 'dupe@test.com',
                    password: 'pw123456',
                })
            ).rejects.toMatchObject({ code: 401 });
        });
    });

    describe('loginAdmin', () => {
        it('returns a truthy token for correct credentials', async () => {
            await adminService.registerAdmin({
                name: 'Login Admin',
                email: 'login@test.com',
                password: 'correctpw',
            });

            const result = await adminService.loginAdmin({
                email: 'login@test.com',
                password: 'correctpw',
            });

            expect(result).toBeTruthy();
            expect(typeof result.token).toBe('string');
            expect(result.token.length).toBeGreaterThan(0);
        });

        it('returns null for a wrong password', async () => {
            await adminService.registerAdmin({
                name: 'Login Admin',
                email: 'login2@test.com',
                password: 'correctpw',
            });

            const result = await adminService.loginAdmin({
                email: 'login2@test.com',
                password: 'wrongpw',
            });

            expect(result).toBeNull();
        });

        it('returns null for an unknown email', async () => {
            const result = await adminService.loginAdmin({
                email: 'nobody@test.com',
                password: 'whatever',
            });
            expect(result).toBeNull();
        });
    });

    describe('getAdminProfile', () => {
        it('returns the admin without the password field', async () => {
            const { admin } = await createAdmin();

            const profile = await adminService.getAdminProfile(admin._id);

            expect(profile).toBeTruthy();
            expect(profile.email).toBe(admin.email);
            expect(profile.password).toBeUndefined();
        });

        it('rejects with 404 when no admin exists for the id', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(adminService.getAdminProfile(missingId)).rejects.toMatchObject({
                code: 404,
            });
        });
    });

    describe('updateAdmin', () => {
        it('updates name and email on the happy path (email not taken)', async () => {
            const { admin } = await createAdmin();

            const updated = await adminService.updateAdmin(admin._id, {
                name: 'Updated Name',
                email: 'updated@test.com',
            });

            expect(updated).toBeTruthy();
            expect(updated.name).toBe('Updated Name');
            expect(updated.email).toBe('updated@test.com');

            const stored = await Admin.findById(admin._id);
            expect(stored.name).toBe('Updated Name');
            expect(stored.email).toBe('updated@test.com');
        });

        it('rejects with 400 when the target email already exists', async () => {
            const { admin } = await createAdmin({ email: 'me@test.com' });
            await createAdmin({ email: 'taken@test.com' });

            await expect(
                adminService.updateAdmin(admin._id, {
                    name: 'X',
                    email: 'taken@test.com',
                })
            ).rejects.toMatchObject({ code: 400 });
        });
    });
});
