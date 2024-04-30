require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const sequelize = new Sequelize(`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

sequelize.authenticate().then(() => {
    console.log('Database connection has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});

const Task = sequelize.define('Task', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignee: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING, // Consider using DataTypes.ENUM for predefined values like ['to-do', 'in-progress', 'completed']
    allowNull: false,
    defaultValue: 'to-do'
  }
});


module.exports = { sequelize, Task };
