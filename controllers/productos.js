const { response } = require('express');
const { existeCategoriaById } = require('../helpers/db-validators');
const Producto = require('../models/producto');



const productosPost = async(req, res = response) => {
    const {estado, usuario, ...data} = req.body;
    
    data.usuario = req.usuario._id;
    
    const producto = new Producto(data);

    await producto.save();

    res.json(producto)

}

const productoGet = async(req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('categoria', 'nombre');

    res.json(producto)
}


const productosGet = async(req, res = response) => {
    const { limite = 2, desde = 0} = req.query;
    /*
    const usuarios = await Usuario.find({estado: true})
    .skip(Number(desde))
    .limit(Number(limite))

    const total = await Usuario.countDocuments({estado: true});
  */
    const [total, producto] = await Promise.all([
      Producto.countDocuments({estado: true}),
      Producto.find({estado: true})
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
          .skip(Number(desde))
          .limit(Number(limite))
    ])

    res.json({
        ok:true,
        msg: 'get API - controllador',
        total: total,
        data: producto
    })
}

const productosPUT = async (req, res = response) => {
    const {id} = req.params;

    const {estado, usuario, ...data} = req.body;

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true}).populate('categoria', 'nombre')

    res.json(producto)
}


const productoDelete = async(req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.json(producto)
}


module.exports = {
    productosPost,
    productoGet,
    productosGet,
    productosPUT,
    productoDelete
}