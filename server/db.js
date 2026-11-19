import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const host = process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
const port = Number(process.env.DB_PORT || 4000);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

if (!user || !password || !database) {
  console.warn('[DB] Warning: DB_USER, DB_PASSWORD, or DB_NAME is missing in environment variables.');
}

export const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 30000,
  connectTimeout: 10000,
  enableKeepAlive: true,
  timezone: 'Z',
  charset: 'utf8mb4',
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

export default { pool, query };
