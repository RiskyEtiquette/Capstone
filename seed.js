require('dotenv').config();
const { sequelize, Task } = require('./back/models'); 

async function seedDatabase() {
    console.log('Starting the seeding process...');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        console.log('Database synced');

        
        const tasksData = [
            {
                title: 'Develop API',
                description: 'Develop the backend API for project management application',
                dueDate: new Date(2024, 4, 20), 
                priority: 'high',
                assignee: 'John Doe',
                status: 'to-do'
            },
            {
                title: 'Database Optimization',
                description: 'Optimize the database queries to improve performance',
                dueDate: new Date(2024, 5, 15),
                priority: 'medium',
                assignee: 'Jane Smith',
                status: 'in-progress'
            },
            {
                title: 'UI Design',
                description: 'Design the user interface for the desktop version',
                dueDate: new Date(2024, 6, 10),
                priority: 'low',
                assignee: 'Alice Johnson',
                status: 'done'
            }
        ];

        for (const data of tasksData) {
            const task = await Task.create(data);
            console.log(`Created task: ${task.title}`);
        }

        console.log('Database seeded!');
    } catch (error) {
        console.error('Failed to seed database:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed');
    }
}

seedDatabase();