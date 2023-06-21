import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { pool, createTodosTable } from './config';

// import { Pool } from 'pg';

const app: Application = express();
app.use(bodyParser.json());


app.get('/', async (req: Request, res: Response) => {
  try {
    res.send("Hi there! Welcome to Todo Api!")
  } catch (error) {
    console.error('Error retrieving todos', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve the list of todos
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM todos');
    const todos = result.rows;
    client.release();
    res.json(todos);
  } catch (error) {
    console.error('Error retrieving todos', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new todo
app.post('/todos', async (req: Request, res: Response) => {

  const { title, description } = req.body;
  // Check if title is provided
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description is required' });
  }
  try {
    const client = await pool.connect();
    client.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2)',
      [title, description]
    ).then(() => {
      client.release();
      res.sendStatus(201);
    }).catch((error) => { res.status(500).json({ error }) })

  } catch (error) {
    console.error('Error adding todo', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
app.delete('/todos', async (req: Request, res: Response) => {
  const { id } = req.query;

  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM todos WHERE id = $1', [id]);
    client.release();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting todo', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a todo as done
app.patch('/todos/done', async (req: Request, res: Response) => {
  const { id } = req.query;

  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }
  try {
    const client = await pool.connect();
    await client.query('UPDATE todos SET done = true WHERE id = $1', [id]);
    client.release();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error marking todo as done', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
createTodosTable()
  .then(() => {
    // Start the server
    const port: number = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error creating "todos" table:', error);
  });
