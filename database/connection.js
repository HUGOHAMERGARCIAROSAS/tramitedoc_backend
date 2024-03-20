const sql = require('mssql')
require('dotenv').config();

const dbSettings = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log('CONEXIÓN EXITOSA');
        return pool;
    } catch (error) {
        console.log('FALLÓ CONEXIÓN');
    }
}

module.exports = getConnection;