# To-Do Management Server
This is the server-side implementation of a To-Do management application following Domain-Driven Design (DDD) principles. The server is built with Node.js, Express.js, and TypeScript, and is containerized using Docker.

## Project Directory Structure
## The server follows a clean DDD architecture:
- src/domain/: Contains the domain models.
- src/application/: Business logic for handling requests.
- src/infrastructure/: Contains the infrastructure layer:
   ⋅⋅* repositories/: Data persistence logic (e.g., saving to files).
   ⋅⋅* routes/: API endpoints for the application.
   ⋅⋅* middleware/: Custom middleware (e.g., authentication).
   ⋅⋅* storage/: JSON-based data storage files.
- app.ts: Initializes the Express app and middleware.
- server.ts: Starts the Express server.


## API Endpoints
## Authentication
|Method	| Endpoint |	Description|
| ---   |  ---     |    ---        |
|POST |	/api/auth/signup|	Sign up a new user|
|POST |	/api/auth/signin	| Log in a user|


## To-Do Management
|Method	| Endpoint |	Description
| ---   |   ---     |    --- 
|GET	| /api/todos |	Get all To-Do items (paginated)
|POST	| /api/todos |	Create a new To-Do item
|PATCH	| /api/todos/:id |	Update an existing To-Do item, and also was for updating status of todo
|DELETE	| /api/todos/:id |	Delete a To-Do item

## Security Measures
1. XSS Prevention: All inputs are sanitized using sanitize-html to strip out malicious scripts.
2. Validation: Input validation is enforced using express-validator to ensure correct data formats.
3. Authentication: Protected routes require a valid JWT token.
4. CSRF Prevention: Use the csurf middleware to generate and validate CSRF tokens and Include the token in state-changing requests via headers

## Technologies Used
- Node.js (v18)
- Express.js
- TypeScript
- Docker
- Docker Compose
- sanitize-html: To prevent XSS attacks.
- express-validator: For request input validation.
- csrf: To prevent CSRF attacks

## Development Principles
- Domain-Driven Design (DDD)
- Clean Architecture

## Setup
1. Copy the `.env.example` file to `.env` and update the necessary variables: `cp .env.example .env`

## Running via Docker
Make sure that you have Docker installed on your machine before running this command. You can download Docker [here](https://www.docker.com/get-started).

Then run the following command:
- `docker-compose up --build`

this will build and run the Docker container for the app. You can then access the app at `http://localhost:5000/api`.


## Running via npm
- `run npm install`
- `run npm run dev`

You can then access the app at `http://localhost:5000/api`.

I didn't use the nodemon because when a user todo is create there will be a change in the todos.json file which will then prompt the app to refresh due to the file change

"dev": "nodemon --watch src --exec 'ts-node' -r tsconfig-paths/register --files src/server.ts",
