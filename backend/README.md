# Project for Conta Simples Backend

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

- Run server
```
yarn dev
```
