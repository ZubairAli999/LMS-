const { STATUS, ROLES } = require('../../../src/utils/constants');

describe('utils/constants', () => {
    describe('STATUS', () => {
        it('exposes the expected HTTP status codes', () => {
            expect(STATUS.OK).toBe(200);
            expect(STATUS.CREATED).toBe(201);
            expect(STATUS.BAD_REQUEST).toBe(400);
            expect(STATUS.NOT_FOUND).toBe(404);
            expect(STATUS.UNPROCESSABLE_ENTITY).toBe(422);
            expect(STATUS.INTERNAL_SERVER_ERROR).toBe(500);
        });
    });

    describe('ROLES', () => {
        it('exposes the admin, teacher and student roles', () => {
            expect(ROLES.admin).toBe('admin');
            expect(ROLES.teacher).toBe('teacher');
            expect(ROLES.student).toBe('student');
        });
    });
});
