# Team Management & Brand Management API

This project provides APIs for managing users, teams, and brands within an organization. It implements role-based access control (RBAC) and allows users with specific roles like `Team Owner (TO)`, `Brand Owner (BO)`, and `Product Owner (PO)` to manage their respective entities.

## Features

- **User Management:** Create, update, and search users.
- **Team Management (TO Role):** View teams, manage team hierarchy, and list users within the team.
- **Brand Management (BO Role):** Manage brand details, add multiple contact persons, and view details based on role permissions.
- **Hierarchical Relationships:** Manage and prevent cyclic dependencies in user hierarchy.
- **Search Functionality:** Search for users across the organization.
- **Role-based Access Control:** Different views and access levels depending on user roles (TO, BO, PO).

## Tech Stack

- **Node.js**: JavaScript runtime environment for building the backend.
- **TypeScript**: Type-safe JavaScript for robust development.
- **Express.js**: Web framework for creating APIs.
- **TypeORM**: Object Relational Mapping (ORM) for database operations.
- **mysql**: Database for persistent data storage.
- **Zod**: TypeScript-first schema declaration and validation library.
- **JWT**: JSON Web Tokens for authentication and authorization.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or above)
- **npm** or **yarn**
- **MySQL** (v13 or above)
- **Git** (for version control)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository:

```bash
git clone https://github.com/vishalp-65/Team-Hierarchy-Management.git
cd Team-Hierarchy-Management
```

### 2. Install dependencies:

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### 3. Configure the database:

- Create a PostgreSQL database.
- Update the `ormconfig.json` file (or `.env` file if you are using environment variables) with your PostgreSQL connection details.

Sample `ormconfig.json`:

```json
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "<your-username>",
    "password": "<your-password>",
    "database": "<your-database>",
    "entities": ["src/entities/*.ts"],
    "synchronize": true
}
```

### 4. Run database migrations (if applicable):

If you are using migrations to keep your database schema in sync:

```bash
npm run typeorm migration:run
```

### 5. Running the server:

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

This will start the development server at `http://localhost:3000/api/v1`.


## Role-based Access Control

- **TO (Team Owner)**: Can manage teams, view team members, and view brands down the hierarchy (without contact person details unless they also have the PO role).
- **BO (Brand Owner)**: Can manage and view brands they own, including contact person details.
- **PO (Product Owner)**: Can view brand details, including contact persons if associated with the brand.

## Validation

- **Zod** is used for request body validation in this project. All required fields and their formats (e.g., phone number, email, roles) are validated using schemas.

## Authentication

- **JWT** tokens are used to authenticate users. Every request that needs authorization should include a Bearer token in the `Authorization` header.
- Example of a request header:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

## Environment Variables

The project uses the following environment variables for configuration:

- `PORT`: The port on which the server runs.
- `DATABASE_URL`: Connection URL for PostgreSQL.
- `JWT_SECRET`: Secret for signing JWT tokens.

You can configure these variables in a `.env` file.

