const {
    successResponseBody,
    errorResponseBody,
    BadRequestResponse,
} = require('../../../src/utils/responesbodymsg');

describe('utils/responesbodymsg', () => {
    it('exports successResponseBody as an object with success=true', () => {
        expect(typeof successResponseBody).toBe('object');
        expect(successResponseBody).not.toBeNull();
        expect(successResponseBody.success).toBe(true);
    });

    it('exports errorResponseBody as an object with success=false', () => {
        expect(typeof errorResponseBody).toBe('object');
        expect(errorResponseBody).not.toBeNull();
        expect(errorResponseBody.success).toBe(false);
    });

    it('exports BadRequestResponse as an object with success=false', () => {
        expect(typeof BadRequestResponse).toBe('object');
        expect(BadRequestResponse).not.toBeNull();
        expect(BadRequestResponse.success).toBe(false);
    });
});
