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

### 🚧 Pre-configuration

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

- configure environment variables
```
JWT_TOKEN_SECRET='minhasenhasecreta'
CARD_FINAL_LENGHT=4
PASSWORD_SALT=8
SENDGRID_API_KEY={SENDGRID_API_KEY}
API_URL = http://localhost:3333
TYPEORM_HOST = localhost
TYPEORM_PORT = 5432
TYPEORM_USERNAME = contasimples
TYPEORM_PASSWORD = contasimples
TYPEORM_DATABASE = conta-simples
TYPEORM_ENTITIES = ./src/app/models/*.ts
TYPEORM_MIGRATIONS = ./src/database/migrations/*.ts
TYPEORM_MIGRATIONS_DIR = ./src/database/migrations
PORT=3000
EMAIL_FORGET_TO=rafaelfernandoribeiro@hotmail.com
EMAIL_FORGET_SUBJECT='Conta Simples - Recuperação de senha'
EMAIIL_FORTE_TEMPLATE='auth/forgot_password'
```

## 🔥 Run application

- Run server
```
yarn dev
```

## ⚛️ Deployment

- The backend application is accessible trougth Heroku server on link:

https://contasimples.herokuapp.com/api/v1

## 🚨 API protocol

- register new user
```
https://contasimples.herokuapp.com/api/v1/user
```
type: POST

body
```
{
	"email": "rfribeiro@gmail.com",
	"mobile": "1111111111",
	"password": "1234"
}
```

response: 201
```
{
  "user": {
    "id": "47798727-e55b-4219-b06f-ab614cc81e96",
    "email": "rfribeiro44@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-26T14:40:14.936Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Nzc5ODcyNy1lNTViLTQyMTktYjA2Zi1hYjYxNG"
}
```

- get user info
```
https://contasimples.herokuapp.com/api/v1/user
```
type: GET

header
```
Bearer TOKEN_RECEIVED_LOGIN
```
body
```
None
```

response: 200
```
{
  "user": {
    "id": "0e9b60a1-257f-4951-b497-9b4c9278f289",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-26T13:19:47.034Z"
  }
}
```

- login
```
https://contasimples.herokuapp.com/api/v1/login
```
type: POST

body
```
{
	"email": "rfribeiro@gmail.com",
	"password": "1234"
}
```

response: 200
```
{
  "user": {
    "id": "e14d1838-3695-456a-9c84-61b1296dd839",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-24T23:26:15.385Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMTRkMTgzOC0zNjk1LTQ1NmEtOWM4NC02MWIxMjk2ZGQ4MzkiLCJlbnRlcnByaXNlSWQiOiI2YzdlOThiNS0zODE5LTQzMDgtYWQ1YS02NjY0ZGM0OTkxZDUiLCJpYXQiOjE2MDM3MjI1MDIsImV4cCI6MTYwMzgwODkwMn0.ftyO8DV_vZnuUoYBNpXJ20sNrMzMaRmt5Zy4LfkAcDQ"
}
```

- forgot password
```
https://contasimples.herokuapp.com/api/v1/forgot_password
```
type: POST

header: none

body
```
{
	"email": "rfribeiro@gmail.com"
}
```

response: 200
```
{
  "user": {
    "id": "e14d1838-3695-456a-9c84-61b1296dd839",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-24T23:26:15.385Z"
  },
  "message": "Email sent with success"
}
```

- reset password
```
https://contasimples.herokuapp.com/api/v1/reset_password
```
type: POST

header: none

body
```
{
	"email": "rfribeiro@gmail.com",
	"token": TOKEN_RECEIVED_BY_EMAIL,
	"password": "123456"
}
```

response: 200
```
{
  "user": {
    "id": "b32cc847-7768-4f6d-a8d2-57cdc8a53038",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-23T00:37:02.251Z"
  },
  "message": "password reset with success"
}
```

- store enterprise
```
https://contasimples.herokuapp.com/api/v1/enterprises
```
type: POST

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

body
```
{
	"name": "My Company",
	"cnpj": "14476206000105"
}
```

response: 201
```
{
  "id": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
  "name": "My Company",
  "cnpj": "14476206000105",
  "createdAt": "2020-10-26T13:38:36.606Z",
  "balance": "0",
  "bankAccount": {
    "bankNumber": 9999,
    "bankName": "CONTA SIMPLES",
    "agency": 1,
    "account": 1,
    "digit": 1,
    "createdAt": "2020-10-26T13:38:36.606Z"
  },
  "cards": null,
  "user": {
    "id": "0e9b60a1-257f-4951-b497-9b4c9278f289",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-26T13:19:47.034Z"
  }
}
```

- enterprise get info
```
https://contasimples.herokuapp.com/api/v1/enterprises
```
type: GET

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

body
```
{
	"name": "My Company",
	"cnpj": "14476206000105"
}
```

response: 200
```
{
  "id": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
  "name": "My Company",
  "cnpj": "14476206000105",
  "createdAt": "2020-10-26T13:38:36.606Z",
  "balance": "0",
  "bankAccount": {
    "bankNumber": 9999,
    "bankName": "CONTA SIMPLES",
    "agency": 1,
    "account": 1,
    "digit": 1,
    "createdAt": "2020-10-26T13:38:36.606Z"
  },
  "cards": null,
  "user": {
    "id": "0e9b60a1-257f-4951-b497-9b4c9278f289",
    "email": "rfribeiro@gmail.com",
    "mobile": "1111111111",
    "createdAt": "2020-10-26T13:19:47.034Z"
  }
}
```

- store new transaction type
```
https://contasimples.herokuapp.com/api/v1/transactions_types
```
type: POST

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

body
```
{
	"type": "CARD",
	"description": "Pagamento cartao de credito"
}
```

response: 201
```
{
  "type": "CARD",
  "description": "Pagamento cartao de credito"
}
```

- store new card
```
https://contasimples.herokuapp.com/api/v1/cards
```
type: POST

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

body
```
{
	"number": "4508283129562222"
}

```

response: 201
```
{
  "id": "1d2f4e72-1f4c-46f6-84f5-a8aed3ca5197",
  "final": "2222",
  "balance": "0"
}
```

- store new transaction
```
https://contasimples.herokuapp.com/api/v1/transactions
```
type: POST

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

body
```
{
    "value": 500.1,
    "type": "PAY",
    "local": "INTERNET",
    "credit": true,
	"finalCard": "4444"
}

```

response: 201
```
{
  "id": "05ab5958-4963-4396-9611-b45be1e6b1cc",
  "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
  "createdAt": "2020-10-26T13:40:38.542Z",
  "value": 500.1,
  "type": "PAY",
  "description": "Pagamento de boleto",
  "local": "INTERNET",
  "credit": true,
  "finalCard": "4444"
}
```

- get transactions
```
https://contasimples.herokuapp.com/api/v1/transactions
```
type: GET

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

query
```
page: (number) - get page number
limit: (number) - limit numbers of returned transactions per page
date_begin: (date) - filter by initial date
date_end: (date) - filter end date
final: (string - length 4 ) - filter by final card number
credit: (boolean) - filter credit transactions
debit: (boolean) - filter debit transactions
```
body
```

```

response: 200
```
{
  "page": 1,
  "limit": 10,
  "total": 2,
  "transactions": [
    {
      "id": "05ab5958-4963-4396-9611-b45be1e6b1cc",
      "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
      "createdAt": "2020-10-26T13:40:38.542Z",
      "value": "500.1",
      "type": "PAY",
      "description": "Pagamento de boleto",
      "local": "INTERNET",
      "credit": true,
      "finalCard": "4444"
    },
    {
      "id": "4c633e7e-5bc0-40bf-8995-a7d7c25dbbba",
      "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
      "createdAt": "2020-10-26T13:40:26.308Z",
      "value": "500.1",
      "type": "CARD",
      "description": "Pagamento cartao de credito",
      "local": "INTERNET",
      "credit": true,
      "finalCard": "2222"
    }
  ]
}
```

- get last transaction by enterprise
```
https://contasimples.herokuapp.com/api/v1/transactions/last
```
type: GET

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

query
```

```
body
```

```

response: 200
```
{
  "id": "05ab5958-4963-4396-9611-b45be1e6b1cc",
  "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
  "createdAt": "2020-10-26T13:40:38.542Z",
  "value": "500.1",
  "type": "PAY",
  "description": "Pagamento de boleto",
  "local": "INTERNET",
  "credit": true,
  "finalCard": "4444"
}
```

- get transactions grouped by card
```
https://contasimples.herokuapp.com/api/v1/transactions/grouped
```
type: GET

header
```
Bearer TOKEN_RECEIVED_LOGIN
```

query
```

```
body
```

```

response: 200
```
{
  "groupedByCards": {
    "2222": [
      {
        "id": "4c633e7e-5bc0-40bf-8995-a7d7c25dbbba",
        "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
        "createdAt": "2020-10-26T13:40:26.308Z",
        "value": "500.1",
        "type": "CARD",
        "description": "Pagamento cartao de credito",
        "local": "INTERNET",
        "credit": true,
        "finalCard": "2222"
      }
    ],
    "4444": [
      {
        "id": "05ab5958-4963-4396-9611-b45be1e6b1cc",
        "enterpriseId": "1c55f090-3cfb-4a44-95aa-72d74c0f204b",
        "createdAt": "2020-10-26T13:40:38.542Z",
        "value": "500.1",
        "type": "PAY",
        "description": "Pagamento de boleto",
        "local": "INTERNET",
        "credit": true,
        "finalCard": "4444"
      }
    ]
  }
}
```

## Tests

- to run tests on the application type:

```
yarn test
```
