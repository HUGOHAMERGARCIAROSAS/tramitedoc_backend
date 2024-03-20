
const jwt = require('jsonwebtoken');
const getConnection = require('../database/connection');
const sql = require('mssql');

const checkAuth = async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const pool = await getConnection();

            const user = await pool.request().input('per_codigo', sql.VarChar(20), decoded.uid)
                .query(`exec sp_usuario @value=@per_codigo, @tipo=4`);

            req.user = user.recordset[0];

            return next();
        } catch
        {
            return res.status(404).json({ message: 'No autorizado' });
        }

    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    next();
};

module.exports = checkAuth;