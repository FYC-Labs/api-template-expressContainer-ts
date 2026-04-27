# Express TS API backend template

## Initial setup
Copy `.env.example` to `.env` and set the variables your deployment needs.

## Install dependencies
```console
yarn install
```

## Generate prisma client and push to db
```console
yarn prisma generate && yarn prisma db push
```

## Run project
```console
yarn dev
```

### TODO
1. Setup unit tests
2. Review github actions deployment
