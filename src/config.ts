import { Pool } from 'pg';
require('dotenv').config();

const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;


// Create a connection pool to the PostgreSQL database
export const pool = new Pool({
    user: databaseUser,
    host: 'localhost',
    database: 'postgres',
    password: databasePassword,
    port: 5432, // or the port where PostgreSQL is running
  });
  

// Function to create the 'todos' table
export async function createTodosTable(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        done BOOLEAN DEFAULT FALSE
      )
    `);
    console.log('Database connection established');
  } catch (error) {
    console.error('Error creating "todos" table:', error);
  } finally {
    client.release();
  }
}
