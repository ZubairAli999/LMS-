const mongoose = require('mongoose');
const svc = require('../../../src/service/academics/subject-service');
const programSvc = require('../../../src/service/academics/program-service');
const Program = require('../../../src/model/Academic/Program');
const Subject = require('../../../src/model/Academic/Subject');
const { createAdmin, createAcademicTerm } = require('../../helpers');

const setup = async () => {
    const { admin } = await createAdmin();
    const term = await createAcademicTerm(admin._id);
    const program = await programSvc.createProgram({
        name: 'Science',
        description: 'Science program',
        userId: admin._id,
    });
    return { admin, term, program };
};

describe('subject-service', () => {
    describe('createSubject', () => {
        it('creates, persists, and pushes id into program subjects', async () => {
            const { admin, term, program } = await setup();

            const subject = await svc.createSubject({
                name: 'Physics',
                description: 'Physics subject',
                academicTerm: term._id,
                userId: admin._id,
                programID: program._id,
            });

            expect(subject).toBeTruthy();
            expect(subject.name).toBe('Physics');
            expect(String(subject.createdBy)).toBe(String(admin._id));

            const persisted = await Subject.findById(subject._id);
            expect(persisted).toBeTruthy();

            const refetchedProgram = await Program.findById(program._id);
            expect(refetchedProgram.subjects).toHaveLength(1);
            expect(String(refetchedProgram.subjects[0])).toBe(String(subject._id));
        });

        it('rejects with 404 when programID does not exist', async () => {
            const { admin, term } = await setup();

            await expect(
                svc.createSubject({
                    name: 'Chemistry',
                    description: 'd',
                    academicTerm: term._id,
                    userId: admin._id,
                    programID: new mongoose.Types.ObjectId(),
                })
            ).rejects.toMatchObject({ code: 404 });
        });

        it('throws 400 on duplicate subject name', async () => {
            const { admin, term, program } = await setup();

            await svc.createSubject({
                name: 'dup subject',
                description: 'd',
                academicTerm: term._id,
                userId: admin._id,
                programID: program._id,
            });

            await expect(
                svc.createSubject({
                    name: 'dup subject',
                    description: 'd2',
                    academicTerm: term._id,
                    userId: admin._id,
                    programID: program._id,
                })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('getSubject', () => {
        it('returns the subject for a valid id', async () => {
            const { admin, term, program } = await setup();
            const created = await svc.createSubject({
                name: 'Biology',
                description: 'd',
                academicTerm: term._id,
                userId: admin._id,
                programID: program._id,
            });

            const found = await svc.getSubject(created._id);
            expect(String(found._id)).toBe(String(created._id));
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.getSubject(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('updateSubject', () => {
        it('updates and returns new values (unique new name)', async () => {
            const { admin, term, program } = await setup();
            const created = await svc.createSubject({
                name: 'old subject',
                description: 'd',
                academicTerm: term._id,
                userId: admin._id,
                programID: program._id,
            });

            const updated = await svc.updateSubject(created._id, {
                name: 'brand new subject',
                description: 'updated desc',
                academicTerm: term._id,
                userId: admin._id,
            });

            expect(updated.name).toBe('brand new subject');
            expect(updated.description).toBe('updated desc');
        });
    });

    describe('deleteSubject', () => {
        it('deletes an existing subject', async () => {
            const { admin, term, program } = await setup();
            const created = await svc.createSubject({
                name: 'to delete',
                description: 'd',
                academicTerm: term._id,
                userId: admin._id,
                programID: program._id,
            });

            const res = await svc.deleteSubject(created._id);
            expect(res).toBeTruthy();

            const gone = await Subject.findById(created._id);
            expect(gone).toBeNull();
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.deleteSubject(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });
});
