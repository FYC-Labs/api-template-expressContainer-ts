<p align="center">
  <a href="" rel="noopener">
    <img width=100px height=100px src=".github/docs/logo.png" alt="Project logo" style="fill:#000000">
  </a>
</p>

<h3 align="center">FYC Backend Express Boilerplate</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()

</div>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Contributing and Coworking](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)
- [Codebase Structure](./docs/CODEBASE_STRUCTURE.md)
- [Code Guidelines](./docs/CODE_GUIDELINES.md)
- [References](#references)

## 📖 About <a name = "about"></a>

This repository contains the boilerplate for FYC's projects using Express + Typescript.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- Docker and docker-compose
- Node.js 14+ (LTS version is recommended)
- Yarn

### Installing

Clone this repository on your local machine. After completed the requirements, including Node.js installation, first you'll need to install all application dependencies (node_modules), you can choose the tool (e.g. Yarn, NPM).

In this example, we will be using Yarn instead of NPM.

```bash
yarn
```

Next, run the application using

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Once the application started, please request MySQL database dump to the Product Owner or setup the application from scratch.

## 🔧 Running the tests <a name = "tests"></a>

To run tests, please execute the command below:
```bash
yarn test
```

Code coverage will be generated on \_\_tests\_\_ page

## 📱 Usage <a name="usage"></a>

Run this application on docker-compose and access it from localhost:3333

## 🚀 Deployment <a name = "deployment"></a>

This application is ready for Docker and docker-compose deployment.

To backend deployment on a Virtual Machine, make a clone of this repository on the target, select the desired branch, and, after completing the requirements, run the following commands:

```bash
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose --env-file .env.ci -f docker-compose.prod.yml build

```

Once the application was built, copy the ```docker-compose.prod.yml``` file to ```docker-compose.yml``` with your environment variables and run the following command:

```bash
docker-compose --env-file .env.ci -f docker-compose.prod.yml up -d
```

Make sure that your Firewalls, Load Balancers and your DNS is well configured. The backend application will be provided at port 3333 by default.

## ⛏️ Built Using <a name = "built_using"></a>

### Backend

- [Node](https://nodejs.org/) - Platform
- [Express](https://expressjs.com/) - Framework
- [Tsrynge](https://github.com/microsoft/tsyringe) - Dependency injection
- [Prisma](https://www.prisma.io/) - ORM
- [TypeScript](https://www.typescriptlang.org/) - Javascript with syntax for types
- [Axios](https://axios-http.com/) - Promise-based HTTP client
- [Jest](https://jestjs.io/) - Testing framework

### General

It's important to mention this tools/patterns which guides the application lifecycle:

- [Git](https://git-scm.com/) - Version control
- [Husky](https://typicode.github.io/husky/#/) - Git hooks
- [Lint Staged](https://github.com/okonet/lint-staged) - Tool to lint commit staged files
- [Commitizen](https://github.com/commitizen/cz-cli) - Git commit message helper
- [Commitlint](https://commitlint.js.org/) - Git commit message linter
- [Standard Version](https://github.com/conventional-changelog/standard-version) - Changelog generator
- [Eslint](https://eslint.org/) - Linter framework
- [Prettier](https://prettier.io/) - Code formatter
- [Semver](https://semver.org/) - Semantic versioning

## 💻 References <a name = "references"></a>

- This project is guided by <a href="https://www.scrum.org/">Scrum</a> agile method using <a href="https://app.clickup.com/">Clickup Software</a>
