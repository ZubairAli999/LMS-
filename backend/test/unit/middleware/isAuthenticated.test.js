const isAuthenticated = require('../../../src/middlewares/isAuthenticated');
const Admin = require('../../../src/model/Staff/Admin');
const { createAdmin, signToken } = require('../../helpers');

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

describe('isAuthenticated middleware', () => {
    it('sets req.userAuth and calls next() for a valid Bearer token', async () => {
        const { admin } = await createAdmin();
        const token = signToken(admin._id);

        const mw = isAuthenticated(Admin);
        const req = { headers: { authorization: 'Bearer ' + token } };
        const res = makeRes();
        const next = jest.fn();

        await mw(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.userAuth).toBeTruthy();
        expect(req.userAuth._id.toString()).toBe(admin._id.toString());
        expect(res.statusCode).toBeNull();
    });

    it('responds 401 UNAUTHORISED and does not call next() for an invalid token', async () => {
        const mw = isAuthenticated(Admin);
        const req = { headers: { authorization: 'Bearer garbage' } };
        const res = makeRes();
        const next = jest.fn();

        await mw(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body).toBeTruthy();
        expect(next).not.toHaveBeenCalled();
    });
});
