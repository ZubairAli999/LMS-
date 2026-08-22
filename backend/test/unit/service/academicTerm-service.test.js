const mongoose = require('mongoose');
const svc = require('../../../src/service/academics/academicTerm-service');
const Admin = require('../../../src/model/Staff/Admin');
const AcademicTerm = require('../../../src/model/Academic/AcademicTerm');
const { createAdmin, createAcademicTerm } = require('../../helpers');

describe('academicTerm-service', () => {
    describe('createAcademicTerm', () => {
        it('creates, persists, and pushes term id into admin academicTerms', async () => {
            const { admin } = await createAdmin();

            const term = await svc.createAcademicTerm({
                name: '1st term',
                description: 'First term',
                duration: '3 months',
                userId: admin._id,
            });

            expect(term).toBeTruthy();
            expect(term.name).toBe('1st term');
            expect(String(term.createdBy)).toBe(String(admin._id));

            const persisted = await AcademicTerm.findById(term._id);
            expect(persisted).toBeTruthy();

            const refetchedAdmin = await Admin.findById(admin._id);
            expect(refetchedAdmin.academicTerms).toHaveLength(1);
            expect(String(refetchedAdmin.academicTerms[0])).toBe(String(term._id));
        });

        it('throws 400 on duplicate name', async () => {
            const { admin } = await createAdmin();
            await svc.createAcademicTerm({
                name: 'dup term',
                description: 'd',
                duration: '3 months',
                userId: admin._id,
            });

            await expect(
                svc.createAcademicTerm({
                    name: 'dup term',
                    description: 'd2',
                    duration: '3 months',
                    userId: admin._id,
                })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('getAcademicTerm', () => {
        it('returns the term for a valid id', async () => {
            const { admin } = await createAdmin();
            const created = await createAcademicTerm(admin._id);

            const found = await svc.getAcademicTerm(created._id);
            expect(String(found._id)).toBe(String(created._id));
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.getAcademicTerm(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('updateAcademicTerm', () => {
        it('updates and returns new values (unique new name)', async () => {
            const { admin } = await createAdmin();
            const created = await createAcademicTerm(admin._id, { name: 'old term' });

            const updated = await svc.updateAcademicTerm(created._id, {
                name: 'brand new term',
                description: 'updated desc',
                duration: '6 months',
                userId: admin._id,
            });

            expect(updated.name).toBe('brand new term');
            expect(updated.description).toBe('updated desc');
            expect(updated.duration).toBe('6 months');
        });
    });

    describe('deleteAcademicTerm', () => {
        it('deletes an existing term', async () => {
            const { admin } = await createAdmin();
            const created = await createAcademicTerm(admin._id);

            const res = await svc.deleteAcademicTerm(created._id);
            expect(res).toBeTruthy();

            const gone = await AcademicTerm.findById(created._id);
            expect(gone).toBeNull();
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.deleteAcademicTerm(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });
});
