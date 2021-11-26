const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    
  const { limite = 2, desde = 0} = req.query;
    /*
    const usuarios = await Usuario.find({estado: true})
    .skip(Number(desde))
    .limit(Number(limite))

    const total = await Usuario.countDocuments({estado: true});
  */
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments({estado: true}),
      Usuario.find({estado: true})
          .skip(Number(desde))
          .limit(Number(limite))
    ])

    res.json({
        ok:true,
        msg: 'get API - controllador',
        total: total,
        data: usuarios
    })
  } 

  const usuariosPost = async (req, res = response) => {
     
      const {nombre, correo, password, rol} = req.body;
      const usuario = new Usuario({ nombre, correo, password, rol});

      //encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync(password, salt);

      await usuario.save();
    res.json({
        ok:true,
        msg: 'post API - controllador',
        body: usuario
    })
  }

 const usuariosPut = async (req, res = response) => {
      const {id} = req.params;
      const { _id, password, google, correo, ...resto } = req.body;

      if( password )
      {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
      }

      const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        ok:true,
        msg: 'put API - controllador',
        usuario: usuario
    })
  }


  const usuariosDelete = async  (req, res = response) => {
     const {id} = req.params;
     const usuarioAutentificado = req.usuario;

     //Elimiar de base de datos
     //const usuario = await Usuario.findByIdAndDelete(id);

     //Cambiar estatus
     const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    res.json({
        ok:true,
        msg: 'delete API - controllador',
        usuario: usuario,
        usuarioAutentificado: usuarioAutentificado
    })
  }


  module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
  }