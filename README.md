## Project Description

This project's main idea was an online reading forum where users can share their favorite reading materials. Each reading material has exactly one publisher (user), so I figured a many-to-many relationship was not needed. Just foreign keys are used to link books to their publishers.

The app supports user authentication through JWT access tokens. These tokens are sent back with response cookies (simulating httpOnly security), and are required for authentication and authorization.

**Important:** When testing with tools like Postman, make sure to include the JWT token in the request cookies for authenticated endpoints.

### Key Points

- Books can be viewed by anyone (no authentication needed).
- Posting a new book requires the user to be authenticated.
- Updating or deleting a book requires the user to be the book's publisher (authorization).

## Main Features

- Centralized error handling using middleware.
- Abstract base repository with reusable CRUD methods for both books and users.
- JWT-based authentication with tokens sent in cookies.
- Simple relational model with foreign keys linking books to users.
- Password hashing via bcrypt

## How to Run

Please take a look at the provided .env.example file (or directly rename it to .env)

In order to start the project, run with npm:
docker:up
migrate
seed
build
start
For testing - test:coverage
