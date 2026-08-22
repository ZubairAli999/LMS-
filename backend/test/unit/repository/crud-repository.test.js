const mongoose = require('mongoose');
const AdminRepository = require('../../../src/repository/staff/admin-repository');
const { hashPassword } = require('../../helpers');

/**
 * The base CrudRepository is abstract (needs a concrete model), so we exercise
 * it through AdminRepository, which extends it and passes the Admin model.
 */
describe('CrudRepository (via AdminRepository)', () => {
    let repo;

    beforeEach(() => {
        repo = new AdminRepository();
    });

    const buildAdminData = async (overrides = {}) => ({
        name: 'CRUD Admin',
        email: 'crud@test.com',
        password: await hashPassword('password123'),
        role: 'admin',
        ...overrides,
    });

    describe('create', () => {
        it('persists and returns the created document', async () => {
            // Arrange
            const data = await buildAdminData();

            // Act
            const created = await repo.create(data);

            // Assert
            expect(created).toBeDefined();
            expect(created._id).toBeDefined();
            expect(created.name).toBe('CRUD Admin');
            expect(created.email).toBe('crud@test.com');
        });
    });

    describe('get', () => {
        it('returns the document for an existing id', async () => {
            // Arrange
            const created = await repo.create(await buildAdminData());

            // Act
            const found = await repo.get(created._id);

            // Assert
            expect(found).not.toBeNull();
            expect(found._id.toString()).toBe(created._id.toString());
        });

        it('returns null for a non-existent id', async () => {
            // Arrange
            const missingId = new mongoose.Types.ObjectId();

            // Act
            const found = await repo.get(missingId);

            // Assert
            expect(found).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of documents', async () => {
            // Arrange
            await repo.create(await buildAdminData({ email: 'a@test.com' }));
            await repo.create(await buildAdminData({ email: 'b@test.com' }));

            // Act
            const all = await repo.getAll();

            // Assert
            expect(Array.isArray(all)).toBe(true);
            expect(all).toHaveLength(2);
        });
    });

    describe('getOne', () => {
        it('returns the first document matching the filter', async () => {
            // Arrange
            await repo.create(await buildAdminData({ email: 'target@test.com' }));

            // Act
            const found = await repo.getOne({ email: 'target@test.com' });

            // Assert
            expect(found).not.toBeNull();
            expect(found.email).toBe('target@test.com');
        });
    });

    describe('update', () => {
        it('returns the updated document with new values ({ new: true })', async () => {
            // Arrange
            const created = await repo.create(await buildAdminData());

            // Act
            const updated = await repo.update(created._id, { name: 'Renamed Admin' });

            // Assert
            expect(updated).not.toBeNull();
            expect(updated.name).toBe('Renamed Admin');
        });
    });

    describe('destroy', () => {
        it('removes the document and returns the removed doc', async () => {
            // Arrange
            const created = await repo.create(await buildAdminData());

            // Act
            const removed = await repo.destroy(created._id);

            // Assert
            expect(removed).not.toBeNull();
            expect(removed._id.toString()).toBe(created._id.toString());
            const afterDelete = await repo.get(created._id);
            expect(afterDelete).toBeNull();
        });

        it('returns null when deleting a non-existent id', async () => {
            // Arrange
            const missingId = new mongoose.Types.ObjectId();

            // Act
            const removed = await repo.destroy(missingId);

            // Assert
            expect(removed).toBeNull();
        });
    });
});
