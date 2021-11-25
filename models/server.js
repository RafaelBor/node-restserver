const express = require('express')
var cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload')

class Server{
    constructor()
    {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.uploadPath = '/api/uploads'

        //Conectar a base de datos
        this.ConectarDB();

        //Middleware
        this.Middleware();

        //Rutas app
        this.routes();
    }

  async ConectarDB()
    {
        await dbConnection();
    }

    Middleware()
    {
        //CORS
        this.app.use(cors())

        //Lectura y parseo del body
        this.app.use(express.json());
 
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes(){
       this.app.use(this.usuariosPath, require('../routes/user'));
       this.app.use(this.authPath, require('../routes/auth'));
       this.app.use(this.categoriasPath, require('../routes/categorias'));
       this.app.use(this.productosPath, require('../routes/productos'));
       this.app.use(this.buscarPath, require('../routes/buscar'));
       this.app.use(this.uploadPath, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("Servidor success", this.port)
        });
    }
}


module.exports = Server;