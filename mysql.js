console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

require('dotenv').config();
const mysql = require('mysql2/promise');

class Database {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('Connected to the company database.');
    } catch (err) {
      console.error('Failed to connect to the database:', err);
      throw err;
    }
  }

  async query(sql, args) {
    console.log('Executing query:', sql);
    console.log('Query arguments:', args);
    try {
      const [rows] = await this.connection.execute(sql, args);
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  
  async close() {
    try {
      await this.connection.end();
      console.log('Connection closed.');
    } catch (err) {
      console.error('Failed to close the database connection:', err);
      throw err;
    }
  }
}

const config = require('./config.js');

const dbConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
};

// Use dbConfig to connect to the database

const db = new Database(config);
db.connect(); 

module.exports = db;









