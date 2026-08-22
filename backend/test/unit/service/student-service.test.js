const mongoose = require('mongoose');

const studentService = require('../../../src/service/students/student-service');
const Admin = require('../../../src/model/Staff/Admin');
const Student = require('../../../src/model/Academic/Student');
// getStudentProfile populates examResults (ExamResult ref), so that model must
// be registered with Mongoose (importing it triggers registration).
require('../../../src/model/Academic/ExamResults');
const { createAdmin, createStudent } = require('../../helpers');

describe('student-service', () => {
    describe('adminRegisterStudent', () => {
        it('creates a student, hashes the password and pushes into admin.students', async () => {
            const { admin } = await createAdmin();

            const student = await studentService.adminRegisterStudent(admin._id, {
                name: 'New Student',
                email: 'newstudent@test.com',
                password: 'plaintextpw',
            });

            expect(student).toBeTruthy();
            expect(student.email).toBe('newstudent@test.com');
            expect(student.password).not.toBe('plaintextpw');

            const refreshedAdmin = await Admin.findById(admin._id);
            const ids = refreshedAdmin.students.map((id) => id.toString());
            expect(ids).toContain(student._id.toString());
        });

        it('rejects with 404 when the admin does not exist', async () => {
            const missingAdminId = new mongoose.Types.ObjectId();
            await expect(
                studentService.adminRegisterStudent(missingAdminId, {
                    name: 'Ghost',
                    email: 'ghost@test.com',
                    password: 'pw123456',
                })
            ).rejects.toMatchObject({ code: 404 });
        });

        it('rejects with 400 when the student email already exists', async () => {
            const { admin } = await createAdmin();
            await createStudent({ email: 'dupe@test.com' });

            await expect(
                studentService.adminRegisterStudent(admin._id, {
                    name: 'Dup',
                    email: 'dupe@test.com',
                    password: 'pw123456',
                })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('loginStudent', () => {
        it('returns a truthy token string for correct credentials', async () => {
            const { admin } = await createAdmin();
            await studentService.adminRegisterStudent(admin._id, {
                name: 'Login Student',
                email: 'loginstudent@test.com',
                password: 'correctpw',
            });

            const token = await studentService.loginStudent('loginstudent@test.com', 'correctpw');

            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('rejects with code 200 for a wrong password (per contract)', async () => {
            const { admin } = await createAdmin();
            await studentService.adminRegisterStudent(admin._id, {
                name: 'Login Student',
                email: 'loginstudent2@test.com',
                password: 'correctpw',
            });

            await expect(
                studentService.loginStudent('loginstudent2@test.com', 'wrongpw')
            ).rejects.toMatchObject({ code: 200 });
        });

        it('rejects with code 200 for an unknown email (per contract)', async () => {
            await expect(
                studentService.loginStudent('nobody@test.com', 'whatever')
            ).rejects.toMatchObject({ code: 200 });
        });
    });

    describe('getStudentProfile', () => {
        it('returns a { studentProfile, currentExamResult } shape', async () => {
            const { student } = await createStudent();

            const result = await studentService.getStudentProfile(student._id);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('studentProfile');
            expect(result).toHaveProperty('currentExamResult');
            expect(result.studentProfile.email).toBe(student.email);
            expect(result.studentProfile.name).toBe(student.name);
        });

        it('rejects with 404 when the student does not exist', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(studentService.getStudentProfile(missingId)).rejects.toMatchObject({
                code: 404,
            });
        });
    });

    describe('getStudentByAdmin', () => {
        it('returns the student when found', async () => {
            const { student } = await createStudent();
            const found = await studentService.getStudentByAdmin(student._id);
            expect(found).toBeTruthy();
            expect(found._id.toString()).toBe(student._id.toString());
        });

        it('rejects with 404 when the student does not exist', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(studentService.getStudentByAdmin(missingId)).rejects.toMatchObject({
                code: 404,
            });
        });
    });

    describe('adminUpdateStudent', () => {
        it('updates name and prefectName via $set and persists them', async () => {
            const { student } = await createStudent();

            const updated = await studentService.adminUpdateStudent(student._id, {
                name: 'Updated Student',
                prefectName: 'Head Boy',
            });

            expect(updated).toBeTruthy();
            expect(updated.name).toBe('Updated Student');
            expect(updated.prefectName).toBe('Head Boy');

            const stored = await Student.findById(student._id);
            expect(stored.name).toBe('Updated Student');
            expect(stored.prefectName).toBe('Head Boy');
        });

        it('rejects with 404 when the student does not exist', async () => {
            const missingId = new mongoose.Types.ObjectId();
            await expect(
                studentService.adminUpdateStudent(missingId, { name: 'X' })
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('writeExam (early-guard rejections)', () => {
        it('rejects with 404 (Student not found) when the student does not exist', async () => {
            const missingStudentId = new mongoose.Types.ObjectId();
            const someExamId = new mongoose.Types.ObjectId();

            await expect(
                studentService.writeExam(missingStudentId, someExamId, [])
            ).rejects.toMatchObject({ code: 404, err: 'Student not found' });
        });

        it('rejects with 404 (Exam not found) when the exam does not exist for a real student', async () => {
            const { student } = await createStudent();
            const missingExamId = new mongoose.Types.ObjectId();

            await expect(
                studentService.writeExam(student._id, missingExamId, [])
            ).rejects.toMatchObject({ code: 404, err: 'Exam not found' });
        });

        // NOTE: the withdrawn/suspended student block sits AFTER the exam
        // lookup + answer-count + already-taken checks, so reaching it requires
        // a fully-built exam (questions, term, matching answer count). That is
        // too fragile for a focused unit test, so it is intentionally skipped.
    });
});
