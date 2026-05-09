import { Pool } from 'pg';

// This creates a "Pool" of connections so your app stays fast
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);