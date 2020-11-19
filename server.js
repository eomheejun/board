const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mainRoutes = require('./routes/api/main');
const app = express(); 

const port = 8000;


app.locals.pretty =true;
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views','./views');

const db = require("./config/keys").mongoURI;

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connectes..'))
    .catch(err => console.log(err));

app.use('/', mainRoutes);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});