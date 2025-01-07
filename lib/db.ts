// cod reutilizabil pentru conectare la postgresql
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  // host: process.env.SUPABASE_HOST,
  // user: process.env.POSTGRES_USER,
  // password: process.env.SUPABASE_PASSWORD,
 // database: process.env.SUPABASE_HOST,
  // port: Number(process.env.SUPABASE_PORT) || 5432,
  connectionString: 

  "postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
 // "postgresql://postgres:[YOUR-PASSWORD]@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres",

  ssl: { rejectUnauthorized: false}
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
  process.exit(-1);
});

export default pool;
