require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Task } = require('./models');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.error('Database configuration is incomplete. Please check environment variables.');
    process.exit(1);
}

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());


app.post('/api/tasks', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task', details: error.message });
    }
});


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send(error.toString());
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task', details: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log(`Attempting to update task ${id} with`, updates); 

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            console.log(`Task with ID ${id} not found`); 
            return res.status(404).send('Task not found');
        }
        Object.assign(task, updates);
        await task.save();
        res.send(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Failed to update task');
    }
});



const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
