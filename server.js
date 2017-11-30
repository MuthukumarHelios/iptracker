'use strict'

const express = require('express');
const app = express();
const controller = require('./controller.js');
const bodyParser = require('body-parser');



// passing the form data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// for UI dependencies
app.use(express.static("./public"));


app.use((req, res, next) => {
    next();
})


app.use(controller);    



app.listen(3000);