FROM node:20.18.0-slim as frontend
WORKDIR /app
COPY ./frontend .
RUN npm i
RUN npm run build


FROM gradle:8-jdk11-alpine as api
WORKDIR /app
COPY ./backend .
COPY --from=frontend /app/dist ./api/src/main/resources/static
RUN ./gradlew :api:build


FROM openjdk:17-alpine
WORKDIR /app
COPY --from=api /app/api/build/libs/api-all.jar .
EXPOSE 8080
CMD ["java", "-jar", "api-all.jar"]