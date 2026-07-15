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
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;
    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json({
                message: 'Data berhasil diupdate',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});
//delete
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM biodata WHERE id = $1 RETURNING *', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json({
                message: 'Data berhasil dihapus',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});

app.listen(port, () => {
    console.log('App running on port ${port}.');
});