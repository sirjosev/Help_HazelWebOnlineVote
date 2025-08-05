const sequelize = require('../config/database');
const User = require('./user');
const Candidate = require('./candidate');
const Event = require('./Event');
const UserVote = require('./UserVote');

// Define associations
// One-to-Many: Event has many Candidates
Event.hasMany(Candidate, {
  foreignKey: 'EventId',
  onDelete: 'CASCADE', // If an event is deleted, its candidates are also deleted
});
Candidate.belongsTo(Event, {
  foreignKey: 'EventId',
});

// Many-to-Many: User has voted in many Events
User.belongsToMany(Event, {
  through: UserVote,
  foreignKey: 'UserId',
});
Event.belongsToMany(User, {
  through: UserVote,
  foreignKey: 'EventId',
});

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Candidate,
  Event,
  UserVote,
};

module.exports = db;
