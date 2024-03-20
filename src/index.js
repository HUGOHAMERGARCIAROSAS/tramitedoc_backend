require ('dotenv').config();

const express = require('express');
const { body,query, validationResult } = require('express-validator');
const app = express();
const getConnection = require('../database/connection');
const cors = require('cors');
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));



app.use('/api', require('../routes'));




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

getConnection();