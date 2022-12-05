const jwt = require('jsonwebtoken');

const config = require('../config/config.json');

class JWT {
    /**
     * @param data
     * @param time
     * @return String
     */
    async sign(data, time) {
        return jwt.sign(data, config.jwtSecret, {expiresIn: time});
    }

    /**
     * @param token
     * @return String
     */
    async verify(token) {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (ex) {
            return '';
        }
    }
}

module.exports = new JWT();