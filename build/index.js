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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
// import { Pool } from 'pg';
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("Hi there! Welcome to Todo Api!");
    }
    catch (error) {
        console.error('Error retrieving todos', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Retrieve the list of todos
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield config_1.pool.connect();
        const result = yield client.query('SELECT * FROM todos');
        const todos = result.rows;
        client.release();
        res.json(todos);
    }
    catch (error) {
        console.error('Error retrieving todos', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Add a new todo
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    // Check if title is provided
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description is required' });
    }
    try {
        const client = yield config_1.pool.connect();
        client.query('INSERT INTO todos (title, description) VALUES ($1, $2)', [title, description]).then(() => {
            client.release();
            res.sendStatus(201);
        }).catch((error) => { res.status(500).json({ error }); });
    }
    catch (error) {
        console.error('Error adding todo', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a todo
app.delete('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    // Check if id is provided
    if (!id) {
        return res.status(400).json({ error: 'Todo ID is required' });
    }
    try {
        const client = yield config_1.pool.connect();
        yield client.query('DELETE FROM todos WHERE id = $1', [id]);
        client.release();
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error deleting todo', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Mark a todo as done
app.patch('/todos/done', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    // Check if id is provided
    if (!id) {
        return res.status(400).json({ error: 'Todo ID is required' });
    }
    try {
        const client = yield config_1.pool.connect();
        yield client.query('UPDATE todos SET done = true WHERE id = $1', [id]);
        client.release();
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error marking todo as done', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Start the server
(0, config_1.createTodosTable)()
    .then(() => {
    // Start the server
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Error creating "todos" table:', error);
});
