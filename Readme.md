# Todo App

A simple Todo App built with Node.js and PostgreSQL.

## Getting Started

### Environment Variables
Make sure to set the following environment variables before running the application:

`DATABASE_USER`: PostgreSQL database user.
`DATABASE_PASSWORD`: PostgreSQL database password.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Lidhya/todo_app-typescript_and_psql.git

2. Navigate to the project directory

3. Install the dependencies: `npm install`

4. Set up the database:

Create a PostgreSQL database.
Update the database configuration in `config.ts` file with your database credentials.

5. Run the application: `npm start`
The application should now be running on `http://localhost:3000`.


###  Usage
- Create a Todo: Send a POST request to `/todos` endpoint with a JSON payload containing the title and description of the Todo.

- Get all Todos: Send a GET request to `/todos` endpoint to retrieve a list of all Todos.

- Mark a Todo as Done: Send a PATCH request to `/todos/done` endpoint with `id` as query, where `id` is the ID of the Todo to be marked as done.

- Delete a Todo: Send a DELETE request to `/todos` endpoint with `id` as query, where `id` is the ID of the Todo to be deleted.

