const { response } = require("express")
const { ObjectId } = require("mongoose").Types;
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')
const Role = require('../models/role')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) =>{
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId)
    {
        const usuario = await Usuario.findById(termino);

        return res.json({
            reults: (usuario) ? [usuario]: []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({
        $or:[{nombre:regex}, {correo:regex}],
        $and: [{estado:true}]
    })

    const total = usuarios.length;

    res.json({
        reults: usuarios,
        total: total
    })
}


const buscarCategoria = async(termino = '', res =response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId)
    {
        const categorias = await Categoria.findById(termino);

        return res.json({
            reults: (categorias) ? [categorias]: []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({nombre:regex, estado:true})

    const total = categorias.length;

    res.json({
        reults: categorias,
        total: total
    })
}


const buscarProducto = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId)
    {
        const productos = await Producto.findById(termino).populate('categoria', 'nombre');

        return res.json({
            reults: (productos) ? [productos]: []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre:regex, estado:true}).populate('categoria', 'nombre')

    const total = productos.length;

    res.json({
        reults: productos,
        total: total
    })
}

const buscar = (req, res = response) => {
    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion))
    {
      return res.status(400).json({
        'msg':`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion)
    {
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;

        case 'categorias':
            buscarCategoria(termino, res)
        break;

        case 'productos':
            buscarProducto(termino, res)
        break;

        default:
            return res.status(500).json({
                'msg':'Error al hacer la busqueda'
            })
    }


}

module.exports = {
    buscar
}