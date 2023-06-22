"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodosTable = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DATABASE_USER, DATABASE_PASSWORD } = process.env;
// Create a connection pool to the PostgreSQL database
exports.pool = new pg_1.Pool({
    user: DATABASE_USER,
    host: 'localhost',
    database: 'postgres',
    password: DATABASE_PASSWORD,
    port: 5432, // or the port where PostgreSQL is running
});
// Function to create the 'todos' table
function createTodosTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield exports.pool.connect();
        try {
            yield client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        done BOOLEAN DEFAULT FALSE
      )
    `);
            console.log('Database connection established');
        }
        catch (error) {
            console.error('Error creating "todos" table:', error);
        }
        finally {
            client.release();
        }
    });
}
exports.createTodosTable = createTodosTable;
