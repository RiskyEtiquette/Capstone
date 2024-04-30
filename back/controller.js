
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const { tasks } = require('./models');  

module.exports = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await tasks.findAll();
            console.log('getAllTasks');
            console.log(tasks)
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).send(error);
        }
    },

    createTask: async (req, res) => {
        try {
            
            const task = await Task.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).send("Failed to create task.");
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            await Task.destroy({ where: { id } });
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).send(error);
        }
    },

    updateTaskStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const task = await Task.findByPk(id);
            if (!task) {
                return res.status(404).send('Task not found');
            }
            task.status = status;
            await task.save();
            res.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).send(error);
        }
    }
};