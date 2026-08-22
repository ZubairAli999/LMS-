const mongoose = require('mongoose');

const isAdmin = require('../../../src/middlewares/isAdmin');
const { createAdmin } = require('../../helpers');

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

describe('isAdmin middleware', () => {
    it('calls next() when the authenticated user is an admin', async () => {
        const { admin } = await createAdmin();

        const req = { userAuth: { _id: admin._id } };
        const res = makeRes();
        const next = jest.fn();

        await isAdmin(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBeNull();
    });

    it('responds 403 FORBIDDEN and does not call next() when no admin is found', async () => {
        const req = { userAuth: { _id: new mongoose.Types.ObjectId() } };
        const res = makeRes();
        const next = jest.fn();

        await isAdmin(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(res.body).toBeTruthy();
        expect(next).not.toHaveBeenCalled();
    });
});
