import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { Task } from './entities/Task';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 You were missing this middleware!
app.use(express.json());

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Task],
  synchronize: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('🟢 Connected to PostgreSQL and ready!');
  })
  .catch((err) => {
    console.error('🔴 Failed to connect to DB:', err);
  });

// ✅ First POST endpoint
app.post('/tasks', (req: any, res: any) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const taskRepo = AppDataSource.getRepository(Task);
  const newTask = taskRepo.create({ title, description });

  taskRepo.save(newTask)
    .then((savedTask) => {
      res.status(201).json(savedTask);
    })
    .catch((err) => {
      console.error('❌ Failed to create task:', err);
      res.status(500).json({ error: 'Database error' });
    });
});

app.get('/tasks', async (req: any, res: any) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const tasks = await taskRepo.find();
    res.json(tasks);
  } catch (err) {
    console.error('❌ Failed to fetch tasks:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/tasks/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOneBy({ id: Number(id) });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update only the fields provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    const updated = await taskRepo.save(task);
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.delete('/tasks/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const result = await taskRepo.delete(Number(id));

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: `Task ${id} deleted` });
  } catch (err) {
    console.error('❌ Failed to delete task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
