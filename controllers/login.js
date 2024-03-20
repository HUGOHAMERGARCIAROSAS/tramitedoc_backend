const getConnection = require('../database/connection');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/generarJWT');


const loginUser = async (req, res) => {
    try {
        const pool = await getConnection();

        const loginRequest = {
            per_login: req.body.usuario,
            per_pass: req.body.password
        }

        const usuario = await pool.request()
            .input('per_login', sql.VarChar(20), loginRequest.per_login)
            .query(`exec sp_usuario @value=@per_login, @tipo=3`);

        if (usuario.recordset.length === 0) {
            return res.status(404).json({
                message: 'El usuario no existe o está desahabilitado.',
            })
        }

        const validPassword = await bcrypt.compare(loginRequest.per_pass, usuario.recordset[0].per_pass);

        if (!validPassword) {
            return res.status(404).json({
                message: 'La contraseña es incorrecta.'
            })
        }

        res.send({ 
            token: generarJWT(usuario.recordset[0].per_codigo),
            user: usuario.recordset[0].per_login,
            id: usuario.recordset[0].per_codigo

         })
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

const authUser = async (req, res) => {
    try{
        const pool = await getConnection();
        const usuario = await pool.request()
        .input('per_codigo', sql.VarChar(20), req.user.per_codigo)
        .query(`exec sp_usuario @value=@per_codigo, @tipo=5`);
        const user = usuario.recordset[0];
        res.json({ user: user.per_login, id: user.per_codigo, nombres: user.nombres });
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    loginUser,
    authUser
}