# Development

## Backend

- Link the gradle project in `./backend`
- run `docker compose up -d` to start all services locally that are needed for the backend
- run the `ApplicationKt` config that is in the project or create an own run config
- the used `config.yml` is in the `/backend/api/src/main/resources` directory, if you want to make changes for local 
development copy it to the `/backend/run` directory 

## Frontend

- go to the frontend directory `cd forntend`
- install dependencies `npm i`
- run the dev setup `npm run dev`

Note: the frontend needs a running backend for requests, the server can be edited in the `/frontend/.env.development` file
