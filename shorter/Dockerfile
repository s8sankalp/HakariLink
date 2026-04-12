# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application (skip tests since they run against the DB)
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Setup the Runtime Environment
# ==========================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/shorter-0.0.1-SNAPSHOT.jar app.jar

# Copy the environment file so the app can connect to NeonDB
COPY .env.prod .

# Expose the default Spring Boot port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
