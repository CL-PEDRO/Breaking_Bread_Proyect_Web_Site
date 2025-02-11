import express from 'express';
import cors from 'cors';
import pool from './db/connect.js'

import userActionsRoute from './routes/userActions.js'
import postRoute from './routes/posts.js'
import userRoute from './routes/users.js'
import recipeRoute from './routes/recipes.js';
import forumRoute from './routes/forum.js'

const app = express();
app.use(cors());
app.use(express.json());


app.use("/posts/userActions",userActionsRoute);
app.use("/posts/info",postRoute);
app.use("/user/info",userRoute);
app.use("/recipe",recipeRoute);
app.use("/forum",forumRoute);


app.get('/', (req, res) => {  
    res.send('Hello World Peter was here ° ͜ʖ ͡°');
  });

app.get('/date', async (req, res) => {
    const result = await pool.query('SELECT NOW() as date;');
    res.json(result[0]);

});


const PORT = process.env.BACKEND_PORT_EXPOSE || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
