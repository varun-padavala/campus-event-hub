FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

# 🔥 FORCE MAVEN DOWNLOAD + BUILD (NO CACHE)
RUN ./mvnw -B clean package

CMD ["sh", "-c", "ls target && java -jar target/*.jar"]
