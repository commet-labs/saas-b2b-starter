import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/saas_dev';

// Create the postgres connection
const client = postgres(connectionString);

// Create the drizzle instance
export const db = drizzle(client, { schema });

// Export the client for advanced usage
export { client };

// Export schema for use in other packages
export * from './schema';
