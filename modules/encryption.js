require("dotenv").config();
const { createHash } = require('crypto');
const l = require(__dirname + "../../modules/logs");

const sha256 = async (string, digest='base64') => {
    try {
        if(digest !== 'base64' || digest !== 'hex') digest = 'base64';
        const result = createHash('sha256').update((string + "")).digest(digest);
        return result;
    } catch (err) {
        await l.dbLog(0, 'system', 'encryption.SHA256', err);
        l.cError(err);
        return createHash('sha256').update((process.env.DEFAULT_ENCRYPTION_STRING)).digest(digest);
    }
}

module.exports = {
    sha256,
}