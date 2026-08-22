const mongoose = require('mongoose');
const svc = require('../../../src/service/academics/exam-service');
const Teacher = require('../../../src/model/Staff/Teacher');
const Exam = require('../../../src/model/Academic/Exam');
const { createTeacher } = require('../../helpers');

const examData = (overrides = {}) => ({
    name: 'Midterm Exam',
    description: 'A midterm exam',
    academicTerm: new mongoose.Types.ObjectId(),
    academicYear: new mongoose.Types.ObjectId(),
    duration: '30 minutes',
    examDate: new Date('2026-01-01'),
    examTime: '10:00',
    examType: 'quiz',
    classLevel: new mongoose.Types.ObjectId(),
    subject: new mongoose.Types.ObjectId(),
    program: new mongoose.Types.ObjectId(),
    ...overrides,
});

describe('exam-service', () => {
    describe('createExam', () => {
        it('creates, persists, and pushes id into teacher examsCreated', async () => {
            const { teacher } = await createTeacher();

            const exam = await svc.createExam({
                ...examData(),
                userId: teacher._id,
            });

            expect(exam).toBeTruthy();
            expect(exam.name).toBe('Midterm Exam');
            expect(String(exam.createdBy)).toBe(String(teacher._id));

            const persisted = await Exam.findById(exam._id);
            expect(persisted).toBeTruthy();

            const refetchedTeacher = await Teacher.findById(teacher._id);
            expect(refetchedTeacher.examsCreated).toHaveLength(1);
            expect(String(refetchedTeacher.examsCreated[0])).toBe(String(exam._id));
        });

        it('rejects with 404 when teacher does not exist', async () => {
            await expect(
                svc.createExam({ ...examData(), userId: new mongoose.Types.ObjectId() })
            ).rejects.toMatchObject({ code: 404 });
        });

        it('throws 400 on duplicate exam name', async () => {
            const { teacher } = await createTeacher();
            await svc.createExam({ ...examData({ name: 'dup exam' }), userId: teacher._id });

            await expect(
                svc.createExam({ ...examData({ name: 'dup exam' }), userId: teacher._id })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('getExam', () => {
        it('returns the exam for a valid id', async () => {
            const { teacher } = await createTeacher();
            const created = await svc.createExam({ ...examData(), userId: teacher._id });

            const found = await svc.getExam(created._id);
            expect(String(found._id)).toBe(String(created._id));
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.getExam(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('updateExam', () => {
        it('updates and returns new values (unique new name)', async () => {
            const { teacher } = await createTeacher();
            const created = await svc.createExam({
                ...examData({ name: 'old exam' }),
                userId: teacher._id,
            });

            const updated = await svc.updateExam(created._id, {
                ...examData({ name: 'brand new exam', description: 'updated desc' }),
                userId: teacher._id,
            });

            expect(updated.name).toBe('brand new exam');
            expect(updated.description).toBe('updated desc');
        });
    });

    describe('deleteExam', () => {
        it('deletes an existing exam', async () => {
            const { teacher } = await createTeacher();
            const created = await svc.createExam({ ...examData(), userId: teacher._id });

            const res = await svc.deleteExam(created._id);
            expect(res).toBeTruthy();

            const gone = await Exam.findById(created._id);
            expect(gone).toBeNull();
        });

        it('returns null for a nonexistent id (service does not throw 404)', async () => {
            const res = await svc.deleteExam(new mongoose.Types.ObjectId());
            expect(res).toBeNull();
        });
    });
});
