const mongoose = require('mongoose');

const teacherService = require('../../../src/service/staff/teacher-service');
const Admin = require('../../../src/model/Staff/Admin');
const Teacher = require('../../../src/model/Staff/Teacher');
const { createAdmin, createTeacher } = require('../../helpers');

describe('teacher-service', () => {
    describe('registerTeacher', () => {
        it('creates a teacher, hashes the password and pushes into admin.teachers', async () => {
            const { admin } = await createAdmin();

            const teacher = await teacherService.registerTeacher({
                name: 'New Teacher',
                email: 'newteacher@test.com',
                password: 'plaintextpw',
                userId: admin._id,
            });

            expect(teacher).toBeTruthy();
            expect(teacher.email).toBe('newteacher@test.com');
            expect(teacher.password).not.toBe('plaintextpw');

            const refreshedAdmin = await Admin.findById(admin._id);
            const ids = refreshedAdmin.teachers.map((id) => id.toString());
            expect(ids).toContain(teacher._id.toString());
        });

        it('rejects with 404 when the registering admin does not exist', async () => {
            const missingAdminId = new mongoose.Types.ObjectId();
            await expect(
                teacherService.registerTeacher({
                    name: 'Ghost',
                    email: 'ghost@test.com',
                    password: 'pw123456',
                    userId: missingAdminId,
                })
            ).rejects.toMatchObject({ code: 404 });
        });

        it('rejects with 400 when the teacher email is already employed', async () => {
            const { admin } = await createAdmin();
            await createTeacher({ email: 'dupe@test.com' });

            await expect(
                teacherService.registerTeacher({
                    name: 'Dup',
                    email: 'dupe@test.com',
                    password: 'pw123456',
                    userId: admin._id,
                })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('loginTeacher', () => {
        it('returns a token object for correct credentials', async () => {
            const { admin } = await createAdmin();
            await teacherService.registerTeacher({
                name: 'Login Teacher',
                email: 'loginteacher@test.com',
                password: 'correctpw',
                userId: admin._id,
            });

            const result = await teacherService.loginTeacher({
                email: 'loginteacher@test.com',
                password: 'correctpw',
            });

            expect(result).toBeTruthy();
            expect(typeof result.token).toBe('string');
        });

        it('returns null for a wrong password', async () => {
            const { admin } = await createAdmin();
            await teacherService.registerTeacher({
                name: 'Login Teacher',
                email: 'loginteacher2@test.com',
                password: 'correctpw',
                userId: admin._id,
            });

            const result = await teacherService.loginTeacher({
                email: 'loginteacher2@test.com',
                password: 'wrongpw',
            });
            expect(result).toBeNull();
        });

        it('returns null for an unknown email', async () => {
            const result = await teacherService.loginTeacher({
                email: 'nobody@test.com',
                password: 'whatever',
            });
            expect(result).toBeNull();
        });
    });

    describe('getTeacherProfile', () => {
        it('returns the teacher without the password field', async () => {
            const { teacher } = await createTeacher();

            const profile = await teacherService.getTeacherProfile(teacher._id);

            expect(profile).toBeTruthy();
            expect(profile.email).toBe(teacher.email);
            expect(profile.password).toBeUndefined();
        });

        it('rejects with 404 when the teacher does not exist', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(teacherService.getTeacherProfile(missingId)).rejects.toMatchObject({
                code: 404,
            });
        });
    });

    describe('adminUpdateTeacher', () => {
        it('assigns program and subject fields and persists them', async () => {
            const { teacher } = await createTeacher();

            const result = await teacherService.adminUpdateTeacher(teacher._id, {
                program: 'Computer Science',
                subject: 'Algorithms',
            });

            expect(result.teacher.program).toBe('Computer Science');
            expect(result.teacher.subject).toBe('Algorithms');

            const stored = await Teacher.findById(teacher._id);
            expect(stored.program).toBe('Computer Science');
            expect(stored.subject).toBe('Algorithms');
        });

        it('rejects with 404 when the teacher does not exist', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(
                teacherService.adminUpdateTeacher(missingId, { program: 'X' })
            ).rejects.toMatchObject({ code: 404 });
        });

        it('rejects with 400 when the teacher is withdrawn', async () => {
            const { teacher } = await createTeacher({ isWithdrawn: true });

            await expect(
                teacherService.adminUpdateTeacher(teacher._id, { program: 'X' })
            ).rejects.toMatchObject({ code: 400 });
        });
    });
});
