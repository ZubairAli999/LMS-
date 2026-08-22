const mongoose = require('mongoose');
const svc = require('../../../src/service/academics/academicYear-service');
const Admin = require('../../../src/model/Staff/Admin');
const AcademicYear = require('../../../src/model/Academic/AcademicYear');
const { createAdmin } = require('../../helpers');

const yearData = (overrides = {}) => ({
    name: '2023/2024',
    fromYear: new Date('2023-09-01'),
    toYear: new Date('2024-06-30'),
    ...overrides,
});

describe('academicYear-service', () => {
    describe('createAcademicYear', () => {
        it('creates, persists, and pushes id into admin academicYear', async () => {
            const { admin } = await createAdmin();

            const year = await svc.createAcademicYear({
                ...yearData(),
                userId: admin._id,
            });

            expect(year).toBeTruthy();
            expect(year.name).toBe('2023/2024');
            expect(String(year.createdBy)).toBe(String(admin._id));

            const persisted = await AcademicYear.findById(year._id);
            expect(persisted).toBeTruthy();

            const refetchedAdmin = await Admin.findById(admin._id);
            expect(refetchedAdmin.academicYear).toHaveLength(1);
            expect(String(refetchedAdmin.academicYear[0])).toBe(String(year._id));
        });

        it('throws 400 on duplicate name', async () => {
            const { admin } = await createAdmin();
            await svc.createAcademicYear({ ...yearData({ name: 'dup year' }), userId: admin._id });

            await expect(
                svc.createAcademicYear({ ...yearData({ name: 'dup year' }), userId: admin._id })
            ).rejects.toMatchObject({ code: 400 });
        });
    });

    describe('getAcademicYear', () => {
        it('returns the year for a valid id', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createAcademicYear({ ...yearData(), userId: admin._id });

            const found = await svc.getAcademicYear(created._id);
            expect(String(found._id)).toBe(String(created._id));
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.getAcademicYear(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });

    describe('updateAcademicYear', () => {
        it('updates and returns new values (unique new name)', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createAcademicYear({
                ...yearData({ name: 'old year' }),
                userId: admin._id,
            });

            const updated = await svc.updateAcademicYear(created._id, {
                name: 'brand new year',
                fromYear: new Date('2025-09-01'),
                toYear: new Date('2026-06-30'),
                userId: admin._id,
            });

            expect(updated.name).toBe('brand new year');
        });
    });

    describe('deleteAcademicYear', () => {
        it('deletes an existing year', async () => {
            const { admin } = await createAdmin();
            const created = await svc.createAcademicYear({ ...yearData(), userId: admin._id });

            const res = await svc.deleteAcademicYear(created._id);
            expect(res).toBeTruthy();

            const gone = await AcademicYear.findById(created._id);
            expect(gone).toBeNull();
        });

        it('rejects with 404 for a nonexistent id', async () => {
            await expect(
                svc.deleteAcademicYear(new mongoose.Types.ObjectId())
            ).rejects.toMatchObject({ code: 404 });
        });
    });
});
