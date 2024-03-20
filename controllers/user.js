const getConnection = require('../database/connection');
const sql = require('mssql');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().input('tipo', sql.Int, 1).query(`exec sp_usuario @tipo=@tipo`);
        if (result.recordsets.length === 0) {
            return res.status(404).json({
                message: 'Error de petición',
                status: 404,
                total: 0
            });
        }
        res.json({
            users: result.recordset,
            total: result.recordset.length,
            status: 200,
            message: 'OK',
            rowsAffected: result.rowsAffected[0]
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

const getUserById = async (req, res) => {

}

const createUser = async (req, res) => {
    try {

        const pool = await getConnection();

        const userRequest = {
            per_login: req.body.per_login,
            per_pass: req.body.per_pass,
            areas_codarea: req.body.areas_codarea,
            per_codigo: req.body.per_codigo

        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userRequest.per_pass, salt);
        userRequest.per_pass = hash;

        const usuario = await pool.request()
            .input('per_codigo', sql.Int, userRequest.per_codigo)
            .input('per_login', sql.VarChar(20), userRequest.per_login)
            .input('per_pass', sql.VarChar(150), userRequest.per_pass)
            .input('areas_codarea', sql.Int, userRequest.areas_codarea)
            .query(`exec sp_usuario @codigo=@per_codigo, @cuarto=@per_login, @quinto=@per_pass, @primero=@areas_codarea, @tipo=2`);

        delete userRequest.per_pass;

        res.json({
            user: userRequest,
            status: 200,
            message: 'OK',
            rowsAffected: usuario.rowsAffected[0]
        })
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

const updateUser = async (req, res) => {

}

const deleteUser = async (req, res) => {

}



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}