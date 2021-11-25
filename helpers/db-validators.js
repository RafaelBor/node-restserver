const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol)
    {
        throw new Error(`El role ${rol} no esta registrado en la base de datos`)
    }
}

const emailExiste = async (correo) => {
    const existe = await Usuario.findOne({correo})
      if(existe)
      {
        throw new Error(`El email ${correo} ya existe`)
      }
}

const existeUsuarioById = async (id) => {
    const existe = await Usuario.findById(id)
      if(!existe)
      {
        throw new Error(`El usuario no existe`)
      }
}

const existeCategoriaById = async (id) => {
  
  const categoria = await Categoria.findById(id);

  if(!categoria)
  {
    throw new Error(`La categoria no existe`)
  }
}

const existeProductoById = async (id) => {
  const producto = await Producto.findById(id)

  if(!producto)
  {
    throw new Error(`El producto no existe`)
  }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById
}