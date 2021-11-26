const { Router} = require('express');
const { check } = require('express-validator');
const { productosPost, productoGet, productosGet, productosPUT, productoDelete } = require('../controllers/productos');
const { existeCategoriaById, existeProductoById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('categoria', 'La categoria no es valida').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], productosPost)

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], productoGet)

router.get('/', productosGet)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], productosPUT)

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], productoDelete)

module.exports = router;