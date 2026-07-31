# Todo Application with Docker

This is a fullstack Todo application consisting of a React frontend, a Node.js Express backend, and a MySQL database.

The project is fully containerized using Docker and Orchestrated using Docker Compose.

## Project Structure

- `/frontend`: React application (served by Nginx in production).
- `/backend`: Node.js Express API.
- `/docker-compose.yml`: Definition for orchestrating MySQL, backend, and frontend containers.

---

## Getting Started (with Docker Compose)

Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 1. Build and Run the containers

In the root directory of the project, run:

```bash
docker-compose up --build
```

This command will:
1. Spin up a MySQL instance, creating a database named `tododb`.
2. Build the backend Docker image, install dependencies, and run the Express app on port `5000`.
3. Build the React frontend production bundle, compile the multi-stage build, load the custom `nginx.conf`, and serve the static assets on port `80`. It will also route all `/api/*` traffic automatically to the backend container.

### 2. Access the Application

- **Frontend Web UI**: Open your browser at [http://localhost](http://localhost)
- **Backend API**: Accessible at [http://localhost:5000](http://localhost:5000) or through the frontend proxy at [http://localhost/api](http://localhost/api)

### 3. Stop the services

To stop and remove all container resources created:

```bash
docker-compose down -v
```
*(The `-v` flag removes the MySQL named volume if you want to wipe the database clean).*
