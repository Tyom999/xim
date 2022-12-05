module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            id: { type: Sequelize.UUID, primaryKey: true },
            refreshTokenSalt: { type: Sequelize.STRING },
            password: { type: Sequelize.STRING, allowNull: false },
            refreshToken: { type: Sequelize.STRING, allowNull: false },
            accessTokenSalt: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false, unique: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('user', { cascade: true });
    }
};