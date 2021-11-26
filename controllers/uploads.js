const { response } = require("express")
const {subirArchivo} = require('../helpers')
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')
const path = require('path');
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);




const cargarArchivo = async(req, res = response) => {
  
    if (!req.files.archivo) {
        res.status(400).json({
            'msg': 'No hay archivos en la peticion'
        });
        return;
      }
     
      try {
      //  const nombreArchivo = await subirArchivo(req.files, ['txt'], 'textos');
      const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombreArchivo
        })
      } catch (error) {
          res.status(400).json({
              'msg': error
          })
      }

  
}


const actualizarImagen = async(req, res = response) =>{
    const {id, coleccion} = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            break;
    }

    if(modelo.img)
    {
        //Borrar imagen del servidor

        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img)

        if(fs.existsSync(pathImagen))
        {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;

    await modelo.save();
    
    res.json({
        modelo
    })
}

const actualizarImagenCloudinary = async(req, res = response) =>{
    const {id, coleccion} = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            break;
    }

    if(modelo.img)
    {
        //Borrar imagen del servidor
        const nombreArr = modelo.img.split('/');

        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        console.log(public_id)

         cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = secure_url;

    await modelo.save();
    
    res.json({
        modelo
    })
}


const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo)
            {
                return res.status(400).json({
                    'msg': `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            break;
    }

    if(modelo.img)
    {
        //Obtener imagen
        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img)
        if(fs.existsSync(pathImagen))
        {
           return res.sendFile(pathImagen)
        }
    }else{
        const pathImagenDef = path.join(__dirname, '../uploads','no-image.jpg')
        return res.sendFile(pathImagenDef)
    }

    res.json({
        'msg': 'falta laceholder'
    })
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}