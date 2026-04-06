FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY backend ./backend

WORKDIR /app/backend

RUN chmod +x mvnw
RUN ./mvnw -B clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]
