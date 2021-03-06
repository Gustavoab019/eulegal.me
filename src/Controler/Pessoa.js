import { openDb } from '../configDB.js';
import nodemailer from 'nodemailer';
import moment from 'moment';

//Database
import dotenv from "dotenv";

dotenv.config();

import { MongoClient } from "mongodb";
const MONGO_PASS = process.env.MONGO_PASS;
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = MONGO_PASS;
const client = new MongoClient(url);

// Database Name
const dbName = 'eulegal';


export async function selectPessoas(req, res){
    ;
        MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db(dbName);
        
        const users = db.collection('users').find({}, {$email: 1});

        users.toArray(function(err, items) {
            if (items){
                res.json(items);
            } else {
                res.json(err)
            }    
            client.close();
        });
    });
    
}

export async function selectPessoa(req, res){
    
    let name = req.body.name;
        MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db(dbName);
        
        const users = db.collection('users');

            users.findOne({"name": name}, {email: 0}, function (findErr, result) {
            if (findErr) throw findErr;
            res.json(result);
            client.close();
        });
    });
}

export async function insertPessoa(req, res){
    let pessoa = req.body;
    let emailId = req.body.email;
    let nameId = req.body.name;
    let data = req.body.date;
    let status = req.body.status;
    let dateNow = Date.now();
    let saveDate = moment(dateNow).format('DD/MM/YYYY HH:mm:ss');
    
    async function main() {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('users');
        await collection.insertOne({
          name: pessoa.name, 
          email:pessoa.email,
          contato: pessoa.contato,
          status: pessoa.status,
          date: pessoa.date,
          dateAceita: newdata,
          dataCadastro: saveDate
        });
        
        return 'done.';
        
    }
        main()
        
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close())
        //res.redirect('/success');

    openDb().then(db=>{
        db.run('INSERT INTO users (name, email, contato, status, date, dataCadastro) VALUES (?,?,?,?,?,?)', [pessoa.name, pessoa.email, pessoa.contato, pessoa.status, pessoa.date, saveDate]);
    });
    res.redirect('/success');

    //let formatData = formatDate(moment(data));
    const stringDate = data;
    const date = new Date(stringDate);


    let acceptOrnot = status.toString();
    let aceita = 'Manifesta????o Aceita';
    let notAceita = 'Manifesta????o N??o Aceita';
    
    //false = Aceita true= N??o aceita
   const statusManisfesta????o = acceptOrnot.includes('N??o') || acceptOrnot.includes('nao');
    
    if(statusManisfesta????o == false) {
        var maniStatus = aceita;
        var marcaAceita = true;
        var dataStatus = date.setDate(date.getDate() + 654); //536
    } else {
        var maniStatus = notAceita
        var marcaAceita = false;
        var dataStatus = date.setDate(date.getDate() + 596); //536
    }

    const newdata = moment(dataStatus).format('DD/MM/YYYY');
    
    sendUser(emailId, nameId, data, newdata, maniStatus, marcaAceita);

    
}

export async function updatePessoa(req, res){
    let pessoa = req.body;
    openDb().then(db=>{
        db.run('UPDATE users SET nome=?, idade=? WHERE id=?', [pessoa.nome, pessoa.email, pessoa.id]);
    });
    res.json({
        "statusCode": 200
    })
}

export async function deletePessoa(req, res){
    let email = req.body.email;
    openDb().then(db=>{
        db.get('DELETE FROM users WHERE email=?', [email])
        .then(res=>res)
    });
    res.json({
        "statusCode": 200
    })
}

export async function sendUser(email, name, data, aceptDate, accept, marcacao){
    const user = process.env.EMAIL_TOKEN;
    const pass = process.env.PASS_TOKEN;
    let newuser = email;
    let nome = name;
    let date = moment(data).format('DD/MM/YYYY');
    let aceptData = aceptDate;
    let acceptOrnot = accept;
    
    if (marcacao == true) {
        var aceitacao = 'MARCA????O';
    } else {
        var aceitacao = 'ACEITA????O';
    }
    

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: "465",
        auth: {user, pass}
    })

    transporter.sendMail({
        from: user,
        to: newuser,
        replyTo: user,
        subject: `Ol?? ${nome}, Bem Vindo ao EuLegal`,
        name: 'EuLegal',
        text: `
Caro(a) Senhor(a)

Aqui est?? mais informa????es de sua manifesta????o de interesse:

ESTADO: ${acceptOrnot}
DATA DA MANIFESTA????O: ${date}
PREVIS??O DE ${aceitacao}: ${aceptData}

______________________________________

Obs: 
- Este dados s??o calculado de acordo com relatos de pessoas que est??o passando pelos mesmos processos, portanto n??o s??o dados oficiais.

- Estamos ajudando centenas de pessoas, que est??o a procura de informa????es sobre suas situa????es.

- Gostaria de apoiar esse projeto inovador:

- Siga-n??s no Instagram - https://www.instagram.com/eulegal.me/

- Entramos no Instagram a pouco tempo ajude-n??s a chegar a 500 seguidores.

- Compartilhe com outras pessoas que est??o aguardando por essas informa????es.

- https://eulegal.herokuapp.com/
______________________________________`


        /* text: `Sua manisfesta????o realizada no dia ${date}, est?? prevista a ser aceita em: ${aceptData}, 
Manisfesta????o: ${acceptOrnot}
________________________________`, */
        
    }).then(info=>{
        console.log(info)
    }).catch(error => {
        console.log(error)
    })  

    
}

export async function zeroFill(n) {
    return n < 9 ? `0${n}` : `${n}`;
}

export async function formatDate(date) {
    const d = zeroFill(date.getDate());
    const mo = zeroFill(date.getMonth() + 1);
    const y = zeroFill(date.getYear());
    const h = zeroFill(date.getHours());
    const mi = zeroFill(date.getMinutes());
    const s = zeroFill(date.getSeconds());

    

    return `${d}/${mo}/${y} ${h}:${mi}:${s}`;

}

