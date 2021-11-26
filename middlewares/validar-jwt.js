const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const validarJWT = async(req = request, res = response, next) =>{
    const token = req.header('x-token');

    console.log(token)
    if(!token){
        return res.status(401).json({
            'msg': "No se envio el token"
        })
    }

    try {
       const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

      const usuario = await Usuario.findById(uid);

       req.usuario = usuario;

       //Validar que el usuario exista
       if(!usuario)
       {
           return res.status(401).json({
            'msg': "Token invalido - El usuario no existe"
            })
       }

       //Validar que sea un usuario activo
       if(usuario.estado == false)
       {
           return res.status(401).json({
            'msg': "Token no valido - false"
            })
       }
       
        next();
        
    } catch (error) {
         res.status(401).json({
            'msg': "Token no valido"
        })
    }


}


module.exports = {validarJWT}