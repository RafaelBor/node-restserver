const mongoose = require('mongoose')

const dbConnection = async() => {

    mongoose.connect(process.env.MONGODB_CNN,
    {    
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    },(err, res) => {    
        if (err) throw err;    console.log('base de datos ONLINE');
    }); 
}


module.exports = {
    dbConnection
}