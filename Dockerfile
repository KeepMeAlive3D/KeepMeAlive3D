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
RUN ./gradlew :api:build -x test


FROM openjdk:23-slim-bullseye
WORKDIR /app
COPY --from=api /app/api/build/libs/api-all.jar .
EXPOSE 8080
CMD ["java", "-jar", "api-all.jar"]