const { Router} = require('express');
const { check } = require('express-validator');
const { categoriasget, categoriasPost, categoriaGet, categoriaPut, categoriaDelete } = require('../controllers/categorias');
const { existeCategoriaById } = require('../helpers/db-validators');


const { validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index')




const router = Router();

router.get('/', categoriasget);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    validarCampos
], categoriasPost)

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], categoriaGet);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('id').custom(existeCategoriaById),
    validarCampos
], categoriaPut)

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    esAdminRole,
    validarCampos
], categoriaDelete)



module.exports = router;