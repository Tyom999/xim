const { Model, DataTypes } = require('sequelize');

class File extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
                ext: { type: DataTypes.STRING },
                size: { type: DataTypes.STRING },
                name: { type: DataTypes.STRING },
                mimetype: { type: DataTypes.STRING }
            },
            {
                sequelize,
                timestamps: true,
                tableName: 'file',

            }
        );
    }
}

module.exports = File;
