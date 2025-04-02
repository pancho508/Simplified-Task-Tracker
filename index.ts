import 'reflect-metadata';
import express, { Request, Response } from 'express';
// import { DataSource } from 'typeorm';
// import { Task } from './entities/Task';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// //   entities: [Task],
//   synchronize: true,
// });

// AppDataSource.initialize()
//   .then(() => {
//     console.log('📦 Data Source initialized');
//   })
//   .catch((err) => {
//     console.error('❌ Data Source init error:', err);
//   });

let db = []

app.post('/tasks', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const todo = { title, description };
  console.log('📥 Task data:', todo);
  db.push(todo);
  console.log('📦 Task db saved:', db);
  res.status(201).json({ message: 'Task received!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



