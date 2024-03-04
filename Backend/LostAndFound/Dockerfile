FROM amazoncorretto:17-al2023-jdk

WORKDIR /app

COPY target/lost-and-found.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
