const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GEOMAP_DATABASE',
    port: 3306
})

connection.connect(function(err){
    if (err){
        throw err;
    }
    else{
        console.log("Database Connected Successfully");
    }
})

module.exports = connection