const { response, request } = require('express');



const esAdminRole = (req = request, res = response, next) =>{

    if(!req.usuario)
    {
        return res.status(500).json({
            'msg': 'Se quiere verificar el rol sin validar token'
        })
    }

    const {rol} = req.usuario;

    if(rol !== 'ADMIN_ROL')
    {
        return res.status(401).json({
            'msg':'El usuario no es administrador'
        })
    }

    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) =>{
        if(!req.usuario)
            {
            return res.status(500).json({
                'msg': 'Se quiere verificar el rol sin validar token'
            })
        }

        if(!roles.includes(req.usuario.rol))
        {
            return res.status(500).json({
                'msg': 'El usuario no tiene permisos'
            })
        }

        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
};