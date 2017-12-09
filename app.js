#!/usr/bin/env node
"use strict";

const app = require('express')(); // initializing Express
const bodyParser=require('body-parser'); // JSON body parsing
const log=require('winston'); //logger
const morgan=require('morgan'); //morgan request logging

app.use(bodyParser.json());
app.use(morgan('dev')); 

app.listen(8080, function () {
    log.info('Listening at http://localhost:8080');
});