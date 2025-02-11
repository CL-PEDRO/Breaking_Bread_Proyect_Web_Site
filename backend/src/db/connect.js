import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'breakingBread_db',
    user: 'root',
    database: 'breaking_bread_db',
    password: 'root123',
    port: 3306
});

export default pool;