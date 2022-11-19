const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

//const cors = require('cors');
//app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//connection to mysql database
const dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'keep1234',
    database: 'nodeapi',
    port: 3306,
})

dbCon.connect();

//retrieve all timezone
app.get('/times',(req, res) =>{
    dbCon.query('SELECT * FROM times', (error, result, fields) => {
        if(error) throw error;

        let message = ""
        if(result === undefined || result.length == 0){
            message = "Times table is empty";
        } else {
            message = "Successfully retrieved all times";
        }
        return res.send({error: false, data: result, message: message});
    })
})

// retrieve timezone by name
app.get('/time/:name', (req, res) => {
    let name = req.params.name;

    if(!name) {
        return res.status(400).send({error: true, message: "Please provide name country"});
    } else {
        dbCon.query("SELECT * FROM times WHERE name = ?", name, (error, result, fields) => {
            if(error) throw error;

            let message = "";
            if(result === undefined || result.length == 0) {
                message = "Timezone not found please input name country";
            } else {
                message = "Successfully retrieve data";
            }

            return res.send({error: false, data:result[0], message: message})
        })
    }
})
app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;
