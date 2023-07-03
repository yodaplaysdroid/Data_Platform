FROM ubuntu:latest

WORKDIR /app

COPY ./njs.sh .
RUN chmod +x ./njs.sh
RUN ./njs.sh
RUN apt install nodejs -y

RUN npm install -g live-server

COPY ./dist .

EXPOSE 8080

CMD live-server --entry-file=index.html