# Create mysql server based on the official image from the dockerhub
FROM mysql:5
# Add a database & root password
ENV MYSQL_DATABASE mean
ENV MYSQL_ROOT_PASSWORD=somePassword
# Run initial scripts for creating tables 
COPY ./social_network.sql /docker-entrypoint-initdb.d/