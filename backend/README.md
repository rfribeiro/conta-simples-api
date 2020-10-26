# Project for Conta Simples Backend

## 🚀 Technology

This project uses the thechnologies below:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Postgres](https://www.postgresql.org/)

## 💻 Description

The project main objective is to develop a bancend application to response some specific endpoints that were defined by Conta Simples.

The backend aplication was developed using NodeJS + express library

The backend will threat messages using REST API

- Login API (implemented using JWT tokenization)
- User registration API (To registry users on the system)
- Enterprise API (to handle enterprises)
- Transaction API (to register and list transactions)
- Transaction query filter parameters that can be possible to filter transactions by init date, end date, credit, debit and card number
- Endpoint to return last transaction that the enterprise did
- Return transctions grouped by card

## 📦 Database model

I'm using postgres database (relational) to store all data from the back end

Database schema describe below:

![database schema](./images/contasimples-database.png)

### Pre-configuration

- Install docker

- Create database struture
```
docker run \
    --name postgres-contasimples \
    -e POSTGRES_USER=contasimples \
    -e POSTGRES_PASSWORD=contasimples \
    -e POSTGRES_DB=conta-simples \
    -p 5432:5432 \
    -d \
    postgres

docker run \
    --name adminer-contasimples \
    -p 8080:8080 \
    --link postgres-contasimples:postgres-contasimples \
    -d \
    adminer
```

- Run database migration to create database structure

check database configuration on the ormconfig.json file

after run the command below

```
yarn typeorm migration:run
```

## 🔥 Run application

- Run server
```
yarn dev
```

## Tests

- to run tests on the application type:

```
yarn test
```
