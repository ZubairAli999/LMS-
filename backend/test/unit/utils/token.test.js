const mongoose = require('mongoose');
const generateToken = require('../../../src/utils/generateToken');
const verifyToken = require('../../../src/utils/verifyToken');

describe('utils/generateToken & utils/verifyToken', () => {
    describe('generateToken', () => {
        it('returns a JWT string', () => {
            // Arrange
            const id = new mongoose.Types.ObjectId().toString();

            // Act
            const token = generateToken(id);

            // Assert
            expect(typeof token).toBe('string');
            // A JWT has three dot-separated segments
            expect(token.split('.')).toHaveLength(3);
        });
    });

    describe('verifyToken', () => {
        it('returns a payload whose id equals the input id', () => {
            // Arrange
            const id = new mongoose.Types.ObjectId().toString();
            const token = generateToken(id);

            // Act
            const decoded = verifyToken(token);

            // Assert
            expect(decoded).toBeDefined();
            expect(decoded.id).toBe(id);
        });

        it('returns { msg: "Invalid token" } for a garbage/invalid token', () => {
            // Arrange
            const badToken = 'this.is.not.a.valid.token';

            // Act
            const result = verifyToken(badToken);

            // Assert
            expect(result).toEqual({ msg: 'Invalid token' });
        });
    });
});
