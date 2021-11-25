const { response } = require("express")
const {subirArchivo} = require('../helpers')




const cargarArchivo = async(req, res = response) => {
  
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({
          'msg': 'No hay archivos en la peticion'
      });
      return;
    }
  
    if (!req.files.archivo) {
        res.status(400).json({
            'msg': 'No hay archivos en la peticion'
        });
        return;
      }

    const nombreArchivo = await subirArchivo(req.files);

    res.json({
        nombreArchivo
    })
  
}


module.exports = {
    cargarArchivo
}