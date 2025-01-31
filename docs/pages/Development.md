# Development

## Backend

- Link the gradle project in `./backend`.
- run `docker compose up -d` to start all services locally that are needed for the backend.
- run the `ApplicationKt` config that is in the project or create an own run config.
- the used `config.yml` is in the `/backend/api/src/main/resources` directory, if you want to make changes for local.
  development copy it to the `/backend/run` directory.

## Frontend

- go to the frontend directory `cd frontend`
- install dependencies `npm i`
- run the dev setup `npm run dev`

Note: The frontend needs a running backend for requests, the server can be edited in the `/frontend/.env.development`
file.

### Frontend tests

- Run `npm test`

### UI tests with Cypress

- Open the Cypress UI with `npx cypress open`
- For the project E2E tests are defined. Click on E2E Testing.
- Select a browser. By default, and also in the CI/CD, Firefox is selected.
- Launch the backend (see Backend) and the frontend (see Frontend).
- The specifications can now be executed from the Cypress UI.

Note: The tests are configured to run in a pipeline. This means that the models are uploaded and not deleted. If run
locally, the models should be deleted.

### Style

To ensure a consistent style, ESLint is used. Before committing, `npm lint` should be run.

### Dependency updates

The repository is configured using Dependabot. Updates are reflected in pull requests and must be manually reviewed and
approved.