import express from 'express';
import { createPool } from 'mysql2/promise';

const app = express();

const pool = createPool({
    host: 'breakingBread_db',
    user: 'root',
    database: 'breaking_bread_db',
    password: 'root123',
    port: 3306
});

app.get('/', (req, res) => {  
    res.send('Hello World!');
  });


app.get('/date', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result[0]);

});
app.listen(3000);

console.log('Server running on http://localhost:3000');

