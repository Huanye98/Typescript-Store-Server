"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new pg_1.Client({
    // connectionString: process.env.DATABASE_URL,
    // ssl:{
    //   rejectUnauthorized: false
    // },
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
});
db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((error) => {
    if (error instanceof Error) {
        console.error('Failed to connect to PostgreSQL', error.message);
    }
    else {
        console.error('Failed to connect to PostgreSQL', error);
    }
});
exports.default = db;
