const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.get('/list', db.getList);

app.post('/list', db.postList);

app.get('/edit/:id', db.getEdit);

app.post('/edit/:id', db.postEdit);

app.post('/remove/:id', db.remove);

app.post('/sort', db.sort);


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})