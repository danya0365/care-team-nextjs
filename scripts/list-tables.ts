import { db } from '../src/infrastructure/database/client';
import { sql } from 'drizzle-orm';

async function listTables() {
  const result = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log('Current Tables:', result.rows.map(r => r.name));
  process.exit(0);
}

listTables().catch(e => {
  console.error(e);
  process.exit(1);
});
