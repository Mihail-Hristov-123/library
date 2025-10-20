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

# API Endpoints

## Users (`/users`)

- **GET /**  
  Get all users. No auth required.

- **GET /:id**  
  Get user by ID (integer). No auth. Errors if missing/invalid ID.

- **POST /register**  
  Register new user. Body: user data. Returns JWT cookie. No auth.

- **POST /login**  
  Login user. Body: credentials. Returns JWT cookie. No auth.

- **POST /logout**  
  Logout user. Clears JWT cookie. Requires auth.

---

## Books (`/books`)

- **GET /**  
  Get all books. No auth.

- **GET /:title**  
  Get book by title (string). No auth. Errors if missing/not found.

- **POST /**  
  Add new book. Body: book data. Requires authentication.

- **PATCH /:title**  
  Update book by title. Body: updates. Requires authorization.

- **DELETE /:title**  
  Delete book by title. Requires authorization.

---

## Notes

- Auth uses JWT tokens in HTTP-only cookies.
- `requireAuthentication` middleware protects routes needing login.
- `requireAuthorization` checks user permissions for modifications.
- Errors thrown for missing params, invalid input, or unauthorized access.
