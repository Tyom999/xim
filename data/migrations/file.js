module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('file', {
            id: { type: Sequelize.UUID, primaryKey: true },
            ext: { type: Sequelize.STRING },
            size: { type: Sequelize.STRING },
            name: { type: Sequelize.STRING },
            mimetype: { type: Sequelize.STRING },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('file', { cascade: true });
    }
};