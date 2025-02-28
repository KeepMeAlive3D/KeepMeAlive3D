# Deployment

## Provide Services

### MySql

Create a mysql db and add the db-migration found
here [db-migration.sql](https://github.com/KeepMeAlive3D/KeepMeAlive3D/blob/main/backend/run/db-migration.sql).

### Mqtt

Create a mqtt service with a client + password to access topics.

### Influx

Create an influx db.

## Clone and build project

Clone the project from GitHub.

### Edit .env files

In order for the front-end to communicate with the back-end, the front-end needs to know the back-end URL to locate
the endpoints.

Edit the [.env.production](https://github.com/KeepMeAlive3D/KeepMeAlive3D/blob/main/frontend/.env.production) file so
that the domain matches the domain you want to deploy to.

### Build Docker File

After all files are edited or created you can build the dockerfile in the project root.

````shell
docker build -t <tag>
````

Also see the GitHub action we use to deploy the
image [dockerhub.yml](https://github.com/KeepMeAlive3D/KeepMeAlive3D/blob/main/.github/workflows/dockerhub.yml).

## Deploy Docker File

````yml
services:
  kma:
    container_name: kma
    image: <image>:<tag>
    volumes:
      - ./config.yml:/app/config.yml
      - ./models:/app/models
    # reverse proxy stuff
    environment:
      VIRTUAL_HOST: kma.matthiasklenz.de
      LETSENCRYPT_HOST: kma.matthiasklenz.de
      LETSENCRYPT_EMAIL: matthias.klenz@outlook.com
      VIRTUAL_PORT: 8080
      WEB_SOCKET_SUPPORT: true
    network_mode: bridge
````

provide the config.yml mentioned in the volumes:

For the backend, create a config.yml file in the run `backend/run` directory with this schema:

````yaml
passphrase: 'xxx'
databases:
  sql:
    host: 'kma.abc.de'
    port: 3306
    schema: 'kma'
    user: 'sampleUser'
    password: 'xxx'
  kafka:
    host: 'xxx'
    port: 8083
    password: 'xxx'
  mqtt:
    host: 'kma.abc.de'
    port: 1883
    clientId: 'user'
    password: 'xxx'
    topic: '#'
  influx:
    host: 'xxx'
    port: 8086
    org: 'xxx'
    bucket: 'xxx'
    token: 'xxx'
pluginDirs: [ "plugins" ]
````

## Reverse Proxy

As an example we use [nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) to automatically generate lets encrypt
certificates. We might have to modify the proxy.conf of nginx to allow for larger bodies. Edit this file and add:
`client_max_body_size 200M;` to allow for bodies up to 200mb.