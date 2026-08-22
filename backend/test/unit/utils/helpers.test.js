const { hashPassword, isPassMatched } = require('../../../src/utils/helpers');

describe('utils/helpers', () => {
    describe('hashPassword', () => {
        it('returns a bcrypt hash that differs from the input password', async () => {
            // Arrange
            const password = 'superSecret123';

            // Act
            const hash = await hashPassword(password);

            // Assert
            expect(typeof hash).toBe('string');
            expect(hash).not.toBe(password);
            // bcrypt hashes start with the $2 algorithm identifier
            expect(hash).toMatch(/^\$2[aby]\$/);
        });
    });

    describe('isPassMatched', () => {
        it('returns true for the correct password against its hash', async () => {
            // Arrange
            const password = 'superSecret123';
            const hash = await hashPassword(password);

            // Act
            const result = await isPassMatched(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('returns false for a wrong password against a hash', async () => {
            // Arrange
            const password = 'superSecret123';
            const hash = await hashPassword(password);

            // Act
            const result = await isPassMatched('wrongPassword', hash);

            // Assert
            expect(result).toBe(false);
        });
    });
});
