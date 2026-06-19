import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export const openDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('transportadora.db');
  }
  return dbInstance;
};

export const initDb = async () => {
  try {
    const db = await openDb();
    
    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // Create deliveries table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        codigo TEXT NOT NULL,
        cepOrigem TEXT,
        cepDestino TEXT,
        formato TEXT,
        peso TEXT,
        tipoFrete TEXT,
        status TEXT DEFAULT 'Postado',
        image_uri TEXT,
        latitude REAL,
        longitude REAL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
};
