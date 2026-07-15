import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa', 
    password: 'nabil2255',
    port: 5432,
})

app.get('/', (req, res) => {
    console.log("TEST DATA :");
    pool.query('SELECT * FROM biodata')
        .then(testDATA => {
            console.log(testDATA.rows);
            res.json(testDATA.rows);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).send("Database Error");
        });
});

app.listen(port, () => {
    console.log('App running on port ${port}.')
})

//post
app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body;
    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]
    )
        .then(result => {
            res.status(201).json({
                message: 'Data berhasil ditambahkan',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});
//put
//delete