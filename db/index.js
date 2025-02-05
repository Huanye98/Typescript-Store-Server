const {Client} = require('pg');
require('dotenv').config();

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized: false
  }
// user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
})

db.connect()
.then(()=>console.log('Connected to PostgreSQL'))
.catch(err=>console.log("Failed to connect to PostgreSQL"))

module.exports = db