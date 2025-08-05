const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserVote = sequelize.define('UserVote', {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // 'Users' is the table name
      key: 'id'
    }
  },
  EventId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Events', // 'Events' is the table name
      key: 'id'
    }
  }
});

module.exports = UserVote;
