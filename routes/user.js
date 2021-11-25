const { Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index')




const router = Router();

router.get('/', usuariosGet)

router.post('/',
    [
        check('nombre', 'El nombre no es valido').not().isEmpty(),
        check('password', 'El password debe de ser minimo 6 letras').isLength({min: 6}),
       // check('role', 'No es un role valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('correo', 'El correo no es valido').isEmail(),
        check('rol').custom((rol) => esRoleValido(rol)),
        check('correo').custom((correo) => emailExiste(correo)),
        validarCampos
    ], 
    usuariosPost)

router.put('/:id',
[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('rol').custom((rol) => esRoleValido(rol)),
    validarCampos

], usuariosPut)

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], usuariosDelete)

module.exports = router;