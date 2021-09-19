'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'SerialNumbers', // table name
        'disabledLineReasons', // new field name
        {
          after:"ProductId",
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'SerialNumbers', // table name
        'disabledLineFlagMsgs', // new field name
        {
          after:"disabledLineReasons",
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('SerialNumbers', 'disabledLineReasons'),
      queryInterface.removeColumn('SerialNumbers', 'disabledLineFlagMsgs'),
    ]);
  }
};
