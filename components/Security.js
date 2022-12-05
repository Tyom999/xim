const bcrypt = require('bcrypt');

class Security {
    /**
     * @param password
     * @return {Promise<*>}
     */
    generatePasswordHash(password) {
        return bcrypt.hash(password, 10);
    }

    /**
     * @param currentPassword
     * @param password
     * @return {*}
     */
    validatePassword(currentPassword, password) {
        return bcrypt.compare(currentPassword, password);
    }
}

module.exports = new Security();