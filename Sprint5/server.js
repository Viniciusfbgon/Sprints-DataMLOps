require('dotenv').config({
    path: '.env'
})

const express = require('express');
const app = express();
cors = require('cors');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((request, response, next) => { //middleware
    response.header("Access-Control-Allow-Origin", "*");                         //Permite que qualquer aplicação consegue fazer uma requisição
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); //Metodos permitidos
    next();
});

const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/', (req, res) => {
  res.send('Desafio Infra\n');
});

app.post('/create', async (req, res) => {
    const { name, hour } = req.body;
    try {
        const client = await pool.connect()
        await client.query(
            'INSERT INTO person (name, time) values ($1, $2)',
            [name, hour]
        )
        client.release()
        return res.send();
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Error")
        process.exit(1);
    }
}); 

app.get('/getInfo', async (req, res) => {
    try {
        const client = await pool.connect()
        r = await client.query('SELECT * FROM person')
        client.release()
        return res.send(r.rows);
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Error")
        process.exit(1);
    }
})
 
module.exports = app.listen(process.env.APP_PORT, () => {
  console.log(`Exemple app listening on port ${process.env.APP_PORT}`);
});