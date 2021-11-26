const { response } = require('express');
const Categoria = require('../models/categoria')

const categoriasget = () => {
    const categorias = Categoria.find({estado:true});

    res.json({
        ok:true,
        msg: 'get API - controllador',
        data: categorias
    })
}

const categoriasPost = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB)
    {
        res.status(400).json({
            'msg': `La categoria ${nombre} ya existe`
        })
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    await categoria.save();

    res.json({
        ok:true,
        msg: 'post categoria API - controllador',
        body: categoria
    })
}


const categoriaGet = async (req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        'categoria': categoria
    })
}


const categoriaPut = async (req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, _id, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        ok:true,
        msg: 'put API categoria - controllador',
        categoria: categoria
    })
}

const categoriaDelete = async(req, res = response) => {
    const {id} = req.params;

   // const categoria = await Categoria.findByIdAndDelete(id).populate('usuario');

   const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.json({
        ok:true,
        msg: 'delete API - controllador',
        categoria: categoria,
    })


}




module.exports = {
    categoriasget,
    categoriasPost,
    categoriaGet,
    categoriaPut,
    categoriaDelete
}