# Users API

This is a demo for implementation part of interview screener. 
It's RESTful JSON API accessing backend MongoDB. 

## Requirements
It should run in Node 8.x or later.

To install Node using NVM.

```
$ nvm install v8.9.1
$ nvm use v8.9.1
```


## Installation 

* install MongoDB first, easiest way is using docker, it will listen on proper port (27017) - https://hub.docker.com/_/mongo/
```
$ docker run -p 27017:27017 --name user-db-mongo -d mongo
```
* install packages, from project root execute
```
$ npm install
```
* import user data to work with
```
$ ./app.js --import ./users.json
```
* start server, it will listen on port 8080 (currently hardcoded)
```
$ ./app.js 
```

## Project structure
- *docs* - Swagger documentation for the API
- *model* - data model for the users
- *test* - acceptance tests for the API
- *users-api* - controller for the API
- *app.js* - main script to run server

## API docs

You can find Swagger API documentation here:
https://rawgit.com/wojta/users-api-screener/master/docs/index.html 

## Tests

You can run acceptance tests for the REST api by this command.

```npm test```

