FROM node:20.18.0-slim AS frontend
WORKDIR /app
COPY ./frontend .
RUN npm i
RUN npm run build


FROM gradle:8-jdk21-alpine AS api
WORKDIR /app
COPY ./backend .
COPY --from=frontend /app/dist ./api/src/main/resources/static
RUN ./gradlew :api:build -x test


FROM openjdk:21-slim-buster
WORKDIR /app
COPY --from=api /app/api/build/libs/api-all.jar .
EXPOSE 8080
CMD ["java", "-jar", "api-all.jar"]