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

## 🚀 Deployments <a name = "deployments"></a>

### Automated deployments

Automated deployments need a service account with the following permissions:
- Artifact Registry Writer
- Cloud Run Admin
- Service Account User.

The container image is stored in GCP's artifact registry in a repository named `api`. Should this repository not exist, it can be created as follows:

```bash
gcloud artifacts repositories create api --repository-format=docker --location="us-central1"
```
Choose the same region where the api is or will be deployed.

### Manual deployments

Manual deployments can be done as follows for the qa environment:

```bash
gcloud auth login
gcloud config set project {{project_id}}
gcloud auth configure-docker us-central1-docker.pkg.dev

docker build -f Dockerfile.prod -t us-central1-docker.pkg.dev/{{project_id}}/api/api-qa:latest .
docker push us-central1-docker.pkg.dev/{{project_id}}/api/api-qa:latest

gcloud run deploy api-qa \
  --image us-central1-docker.pkg.dev/{{project_id}}/api/api-qa:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --ingress internal \
  --network default \
  --subnet default
```

Production deployments work the same way, but the service name is `api-main`. The region can be changed to the desired one.

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
