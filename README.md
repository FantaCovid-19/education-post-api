# Post Api for the project

A project developed with Node.js, TypeScript, and JWT security, serving as a backend for a posts application. It includes user authentication, Jest testing for code quality assurance, and clear, readable documentation via Swagger. Additionally, the project has been developed for educational purposes

![GitHub last commit](https://img.shields.io/github/last-commit/FantaCovid-19/Post-Api)
![GitHub issues](https://img.shields.io/github/issues/FantaCovid-19/Post-Api)
![GitHub closed issues](https://img.shields.io/github/issues-closed/FantaCovid-19/Post-Api)
![GitHub pull requests](https://img.shields.io/github/issues-pr/FantaCovid-19/Post-Api)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/FantaCovid-19/Post-Api)

## Table of Contents

- [Post Api for the project](#post-api-for-the-project)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [Documentation](#documentation)
  - [Installation](#installation)
  - [Testing](#testing)
  - [License](#license)

## Usage

The application provides a REST API for a posts application. It features user authentication, allowing users to create an account, log in, and log out. Once logged in, users can create, read, update, and delete posts. Users can also view all posts, view posts by a specific user.

## Documentation

The application uses Swagger for documentation. To view the documentation, run the application and navigate to http://localhost:3000/api-docs.

## Installation

1. Clone the repository
2. Install dependencies

```bash
  npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
  # App Configuration
  APP_NAME="Post Api"
  PORT="3000"

  # URL Configuration
  LOCAL_URL="http://localhost:3000"
  PRODUCTION_URL="http://localhost:3000"

  # Auth Configuration
  JWT_SECRET=""
  SESSION_SECRET=""
  SALT_ROUNDS=""

  # Database Configurarion
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/post_api"

  # Test Configuration
  TOKEN_TESTING = "example_token.jwt"
```

4. Run the application

```bash
  npm run build
  npm run start

  # or for development

  npm run dev
```

## Testing

The application uses Jest for testing. To run the tests, run the following command:

```bash
  npm run test
```

## License

[GNU GPL V3](https://opensource.org/license/gpl-3-0/)
