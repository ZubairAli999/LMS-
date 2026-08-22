const mongoose = require('mongoose');
const svc = require('../../../src/service/academics/program-service');
const Admin = require('../../../src/model/Staff/Admin');
const Program = require('../../../src/model/Academic/Program');
const { createAdmin } = require('../../helpers');

describe('program-service', () => {
    describe('createProgram', () => {
        it('creates, persists, and pushes id into admin programs', async () => {
            const { admin } = await createAdmin();

            const program = await svc.createProgram({
                name: 'Computer Science',
                description: 'CS program',
                userId: admin._id,
            });

            expect(program).toBeTruthy();
            expect(program.name).toBe('Computer Science');
            expect(String(program.createdBy)).toBe(String(admin._id));

            const persisted = await Program.findById(program._id);
            expect(persisted).toBeTruthy();

            const refetchedAdmin = await Admin.findById(admin._id);
            expect(refetchedAdmin.programs).toHaveLength(1);
            expect(String(refetchedAdmin.programs[0])).toBe(String(program._id));
        });

        it('throws 400 on duplicate name', async () => {
            const { admin } = await createAdmin();
            await svc.createProgram({ name: 'dup prog', description: 'd', userId: admin._id });

            await expect(
                svc.createProgram({ name: 'dup prog', description: 'd2', userId: admin._id })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('getProgram', () => {
        it('returns the program for a valid id', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createProgram({
                name: 'Maths',
                description: 'd',
                userId: admin._id,
            });

            const found = await svc.getProgram(created._id);
            expect(String(found._id)).toBe(String(created._id));
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.getProgram(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('updateProgram', () => {
        it('updates and returns new values (unique new name)', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createProgram({
                name: 'old prog',
                description: 'd',
                userId: admin._id,
            });

            const updated = await svc.updateProgram(created._id, {
                name: 'brand new prog',
                description: 'updated desc',
                userId: admin._id,
            });

            expect(updated.name).toBe('brand new prog');
            expect(updated.description).toBe('updated desc');
        });
    });

    describe('deleteProgram', () => {
        it('deletes an existing program', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createProgram({
                name: 'to delete',
                description: 'd',
                userId: admin._id,
            });

            const res = await svc.deleteProgram(created._id);
            expect(res).toBeTruthy();

            const gone = await Program.findById(created._id);
            expect(gone).toBeNull();
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.deleteProgram(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });
});
