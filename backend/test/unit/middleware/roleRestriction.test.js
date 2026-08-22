const roleRestriction = require('../../../src/middlewares/roleRestriction');

function makeRes() {
    return {
        statusCode: null,
        body: null,
        status(c) {
            this.statusCode = c;
            return this;
        },
        json(b) {
            this.body = b;
            return this;
        },
    };
}

describe('roleRestriction middleware', () => {
    it('returns a middleware function', () => {
        expect(typeof roleRestriction('admin')).toBe('function');
    });

    it('calls next() and does not respond when the role is allowed', () => {
        const mw = roleRestriction('admin');
        const req = { userAuth: { role: 'admin' } };
        const res = makeRes();
        const next = jest.fn();

        mw(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBeNull();
    });

    it('responds 403 FORBIDDEN and does not call next() when the role is not allowed', () => {
        const mw = roleRestriction('admin');
        const req = { userAuth: { role: 'student' } };
        const res = makeRes();
        const next = jest.fn();

        mw(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(res.body).toBeTruthy();
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 403 when userAuth is missing entirely', () => {
        const mw = roleRestriction('admin');
        const req = {};
        const res = makeRes();
        const next = jest.fn();

        mw(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });
});
