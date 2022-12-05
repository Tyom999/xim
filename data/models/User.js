const { omit: _omit } = require('lodash');
const { Model, DataTypes } = require('sequelize');

const { Jwt, Security, Util } = require('../../components');

class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
                password: { type: DataTypes.STRING, allowNull: false },
                refreshTokenSalt: { type: DataTypes.STRING },
                accessTokenSalt: { type: DataTypes.STRING },
                refreshToken: { type: DataTypes.STRING },
                email: {
                    allowNull: false,
                    type: DataTypes.STRING,
                    unique: { message: 'email_is_unique' },
                    validate: { isEmail: true, len: [0, 70] } }
            },
            {
                sequelize,
                timestamps: true,
                tableName: 'user',
                hooks: { beforeSave: User.hookBeforeSave }

            }
        );
    }

    static async hookBeforeSave(user) {
        if (user.isNewRecord || user.changed('password')) {
            user.accessTokenSalt = Util.generateRandomString(6);
            user.refreshTokenSalt = Util.generateRandomString(6);
            user.password = await Security.generatePasswordHash(user.password);
        }
    }

    comparePassword(currentPassword = '') {
        return Security.validatePassword(currentPassword, this.password);
    }

    async generateToken(accessTokenSalt, refreshTokenSalt) {
        return {
            type: 'jwt',
            access: await Jwt.sign({ salt: accessTokenSalt || this.accessTokenSalt, id: this.id }, '10m'),
            refresh: await Jwt.sign({ salt: refreshTokenSalt || this.refreshTokenSalt, id: this.id }, '30m')
        };    }

    toJSON() {
        const model = this.get();
        const hiddenFields = ['password', 'accessTokenSalt'];

        return _omit(model, hiddenFields);
    }
}

module.exports = User;