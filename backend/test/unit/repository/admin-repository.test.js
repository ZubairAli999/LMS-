const mongoose = require('mongoose');
const AdminRepository = require('../../../src/repository/staff/admin-repository');
const { createAdmin } = require('../../helpers');

// getProfile() populates related refs, so those models must be registered with
// mongoose. Requiring them registers their schemas (side-effect import).
require('../../../src/model/Academic/AcademicYear');
require('../../../src/model/Academic/AcademicTerm');
require('../../../src/model/Academic/Program');
require('../../../src/model/Academic/YearGroup');
require('../../../src/model/Academic/ClassLevel');
require('../../../src/model/Staff/Teacher');
require('../../../src/model/Academic/Student');

describe('AdminRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new AdminRepository();
    });

    describe('findByEmail', () => {
        it('returns the admin matching the email', async () => {
            // Arrange
            const { admin } = await createAdmin({ email: 'find@test.com' });

            // Act
            const found = await repo.findByEmail('find@test.com');

            // Assert
            expect(found).not.toBeNull();
            expect(found._id.toString()).toBe(admin._id.toString());
            expect(found.email).toBe('find@test.com');
        });

        it('returns null when no admin has that email', async () => {
            // Act
            const found = await repo.findByEmail('absent@test.com');

            // Assert
            expect(found).toBeNull();
        });
    });

    describe('pushToField', () => {
        it('pushes a value onto the field and persists it', async () => {
            // Arrange
            const { admin } = await createAdmin();
            const termId = new mongoose.Types.ObjectId();
            const before = admin.academicTerms.length;

            // Act
            const result = await repo.pushToField(admin._id, 'academicTerms', termId);

            // Assert
            expect(result).not.toBeNull();
            expect(result.academicTerms).toHaveLength(before + 1);
            // Re-fetch from the DB to confirm persistence
            const refetched = await repo.get(admin._id);
            expect(refetched.academicTerms).toHaveLength(before + 1);
            expect(refetched.academicTerms.map((t) => t.toString())).toContain(
                termId.toString()
            );
        });

        it('returns null for a non-existent admin id', async () => {
            // Arrange
            const missingId = new mongoose.Types.ObjectId();

            // Act
            const result = await repo.pushToField(
                missingId,
                'academicTerms',
                new mongoose.Types.ObjectId()
            );

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getProfile', () => {
        it('returns the admin without the password field', async () => {
            // Arrange
            const { admin } = await createAdmin();

            // Act
            const profile = await repo.getProfile(admin._id);

            // Assert
            expect(profile).not.toBeNull();
            expect(profile._id.toString()).toBe(admin._id.toString());
            expect(profile.password).toBeUndefined();
        });
    });
});
