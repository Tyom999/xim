const randomString = require('randomstring');

class Util {
    /**
     * @param length
     * @return String
     */
    generateRandomString(length = 32) {
        return randomString.generate({length, charset: 'alphabetic'});
    }

    /**
     * @param fileName
     * @return String
     */
    getFilePath(fileName) {
        return __dirname + '/../files/' + fileName;
    }
}

module.exports = new Util();