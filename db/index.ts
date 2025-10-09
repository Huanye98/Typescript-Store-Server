import {Client} from "pg";
import dotenv from "dotenv"

dotenv.config();

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized: false
  },
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
})

db.connect()
.then(()=>console.log('Connected to PostgreSQL'))
.catch((error:unknown)=>{
  if(error instanceof Error){
    console.error('Failed to connect to PostgreSQL', error.message)
  }else{
    console.error('Failed to connect to PostgreSQL', error)
  }
})

export default db