const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('voter', 'admin'),
    defaultValue: 'voter',
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null for admin or if not applicable
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Can be null for admin
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Method to check password
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = User;
