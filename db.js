const Pool = require('pg').Pool;
const url = require('url');
require('dotenv').config()

const DBConnectionString = process.env.DATABASE_URL;
if (DBConnectionString.includes('@localhost:5432')) {
    SSL = false;
} else {
    SSL = {sslmode: 'require', rejectUnauthorized: false };
}

const pool = new Pool({connectionString:DBConnectionString, ssl:SSL});

const getList = (req, res) => {
    pool.query('select * from users', (err, results) => {
        if (err) throw err;
        res.render('list', { users: results.rows })
    })
}

const postList = (req, res) => {
    var id;
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const age = req.body.age;
    pool.query('select max(id) from users', (err, results) => {
        id = results.rows[0].max + 1;
        pool.query('insert into users (id, first, last, email, age) values ($1, $2, $3, $4, $5)', [id, first, last, email, age], (err, results) => {
            if (err) throw err;
            res.redirect('/list')
        })
    })
}

const getEdit = (req, res) => {
    pool.query('select * from users where id = $1', [req.params.id], (err, results) => {
        if (err) throw err
        res.render('edit', { user: results.rows[0] })
    });
}

const postEdit = (req, res) => {
    const id = req.params.id;
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const age = req.body.age;
    pool.query('update users set first = $2, last = $3, email = $4, age = $5 where id = $1', [id, first, last, email, age], (err, results) => {
        if (err) throw err
        res.redirect('/list')
    });
}

const remove = (req, res) => {
    pool.query('delete from users where id = $1', [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/list')
    })
}

const sort = sortUsers = (req, res) => {
    if (req.body.sort =='search') {
        pool.query('select * from users where first = $1 OR last = $1', [req.body.search], (err, results) => {
            if (err) throw err;
            res.render('list', { users: results.rows })
        })
    } else
    if (req.body.sort == 'ascending') {
        pool.query('select * from users order by first ASC', (err, results) => {
            if (err) throw err;
            res.render('list', { users: results.rows })
        })
    } else
    if (req.body.sort == 'descending') 
        pool.query('select * from users order by first DESC', (err, results) => {
            if (err) throw err;
            res.render('list', { users: results.rows })
        })
}

module.exports = {
    getList,
    postList,
    getEdit,
    postEdit,
    remove,
    sort
}