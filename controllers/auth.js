const {response} = require('express');
const Usuario = require('../models/usuario');
const bcriptjs = require('bcryptjs');
const generarJWT = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo, estado:true})
        if(!usuario){
            return res.status(400).json({
                'msg': 'El correo o el password no son correctos'
            })
        }

        const validarPassword = bcriptjs.compareSync(password, usuario.password)
        if(!validarPassword)
        {
            return res.status(400).json({
                'msg': 'el password no es correcto'
            })
        }

        //GENERAR TOKEN
        const token = await generarJWT(usuario.id);

        res.json({
            token: token,
            usuario: usuario
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            'msg': 'hubo un error'
        })
    }

}


const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario)
        {
            const data = {
                nombre,
                correo,
                password:"as",
                img,
                google: true
            }

            const usuario = new Usuario(data);
             await usuario.save();
        }

        if(!usuario?.estado)
        {
            return res.status(401).json({
                'msg': 'Hable con el administrador, usuario bloqueado'
            })
        }

        //GENERAR TOKEN
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            'ok':false,
            'msg': "El token no se pudo verificar"
        })
    }

}


module.exports = {
    login,
    googleSignIn
  }