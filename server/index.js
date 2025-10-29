const express = require('express');
const app = express();
const env = require('dotenv'); // to store constant variables in env file
const cors = require('cors'); // to prevent cors policy error

const db = require('./db');
const router = require('./routes/mapRoute');



env.config();
db


const port = process.env.port;

app.use(express.json());
app.use(cors());

app.use('/api',router)

//listen to port 2000
app.listen(port,()=>{
    console.log(`Running on Port ${port}`);
})