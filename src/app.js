import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
//import Mongoose from "mongoose";
import router from './routes.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

/* const dbURI = process.env.MONGO_PASS;
Mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(process.env.PORT || 3000, ()=>console.log("Api Rodando.")))
    .catch((err) => console.log(err)) */

app.use(router);

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, ()=>console.log("Api Rodando."))


https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')
}, app).listen(3001, ()=> console.log("Rodando em https"));