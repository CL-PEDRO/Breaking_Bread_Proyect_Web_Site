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
    res.send('Hello Worldasdaklsdnañkb');
  });


app.get('/date', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result[0]);

});


app.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM products;');
    res.json(result[0]);
  });


  app.post('/products', async (req, res) => {

    const { name, description } = req.body;
    console.log(req.body);
    
  
    await pool.query('INSERT INTO products (name, description) VALUES (?, ?)', [name, description]);
    res.json({ message: 'Product created', 'code': 'APP-01' });
  });
   
app.listen(3000);

console.log('Server running on http://localhost:5000');

