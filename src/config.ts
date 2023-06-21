import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_USER, DATABASE_PASSWORD } = process.env;

// Create a connection pool to the PostgreSQL database
export const pool = new Pool({
  user: DATABASE_USER,
  host: 'localhost',
  database: 'postgres',
  password: DATABASE_PASSWORD,
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
