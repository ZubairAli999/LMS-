const mongoose = require('mongoose');
const AcademicTermRepository = require('../../../src/repository/academics/academicTerm-repository');
const { createAdmin } = require('../../helpers');

describe('AcademicTermRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new AcademicTermRepository();
    });

    const buildTermData = (createdBy, overrides = {}) => ({
        name: '1st term',
        description: 'First term of the year',
        duration: '3 months',
        createdBy,
        ...overrides,
    });

    describe('findByName', () => {
        it('returns the academic term matching the name', async () => {
            // Arrange
            const { admin } = await createAdmin();
            await repo.create(buildTermData(admin._id));

            // Act
            const found = await repo.findByName('1st term');

            // Assert
            expect(found).not.toBeNull();
            expect(found.name).toBe('1st term');
            expect(found.createdBy.toString()).toBe(admin._id.toString());
        });

        it('returns null for a missing name', async () => {
            // Act
            const found = await repo.findByName('does-not-exist');

            // Assert
            expect(found).toBeNull();
        });
    });

    describe('inherited CRUD methods', () => {
        it('get returns the term by id', async () => {
            // Arrange
            const { admin } = await createAdmin();
            const created = await repo.create(buildTermData(admin._id));

            // Act
            const found = await repo.get(created._id);

            // Assert
            expect(found).not.toBeNull();
            expect(found._id.toString()).toBe(created._id.toString());
        });

        it('update returns the updated term with new values', async () => {
            // Arrange
            const { admin } = await createAdmin();
            const created = await repo.create(buildTermData(admin._id));

            // Act
            const updated = await repo.update(created._id, { name: '2nd term' });

            // Assert
            expect(updated).not.toBeNull();
            expect(updated.name).toBe('2nd term');
        });

        it('destroy removes the term and returns it', async () => {
            // Arrange
            const { admin } = await createAdmin();
            const created = await repo.create(buildTermData(admin._id));

            // Act
            const removed = await repo.destroy(created._id);

            // Assert
            expect(removed).not.toBeNull();
            expect(removed._id.toString()).toBe(created._id.toString());
            const afterDelete = await repo.get(created._id);
            expect(afterDelete).toBeNull();
        });
    });
});
