FROM node:20.18.0-slim AS frontend
WORKDIR /app
COPY ./frontend .
RUN npm i
RUN npm run build-prod


FROM gradle:8-jdk23-alpine AS api
ARG GITHUB_REF="refs/tags/0.1-docker-local"
ENV GITHUB_REF=$GITHUB_REF
WORKDIR /app
COPY ./backend .
COPY --from=frontend /app/dist ./api/src/main/resources/static
RUN ./gradlew :api:installDist -x test


FROM ghcr.io/graalvm/native-image-community:23
WORKDIR /app
COPY --from=api /app/api/build/install/api ./api-dist
EXPOSE 8080
ENTRYPOINT ["./api-dist/bin/api"]