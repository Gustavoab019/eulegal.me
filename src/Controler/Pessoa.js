import { openDb } from '../configDB.js';
import nodemailer from 'nodemailer';
import moment from 'moment';


export async function createTable(){
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER )')
    })
}

export async function selectPessoas(req, res){
    openDb().then(db=>{
        db.all('SELECT * FROM users')
        .then(email=>  res.json(email))
    });
}

export async function selectPessoa(req, res){
    let id = req.body.id;
    openDb().then(db=>{
        db.get('SELECT * FROM users WHERE id=?', [id])
        .then(pessoa=> res.json(pessoa) );
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
    


    openDb().then(db=>{
        db.run('INSERT INTO users (name, email, status, date, dataCadastro) VALUES (?,?,?,?,?)', [pessoa.name, pessoa.email, pessoa.status, pessoa.date, saveDate]);
    });
    res.redirect('/success');

    //let formatData = formatDate(moment(data));
    const stringDate = data;
    const date = new Date(stringDate);
    date.setDate(date.getDate() + 536); //536
    const dataaaaa = moment(date).format('DD/MM/YYYY');

    const response = status.toString();
    

    sendUser(emailId, nameId, data, dataaaaa, response);
    
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
    let id = req.body.id;
    openDb().then(db=>{
        db.get('DELETE FROM users WHERE id=?', [id])
        .then(res=>res)
    });
    res.json({
        "statusCode": 200
    })
}

export async function sendUser(email, name, data, aceptDate, accept){
    const user = "news@eulegal.me";
    const pass = "Gustavoab007@";
    let newuser = email;
    let nome = name;
    let date = moment(data).format('DD/MM/YYYY');
    let aceptData = aceptDate;
    let acceptOrnot = accept;


    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: "465",
        auth: {user, pass}
    })

    transporter.sendMail({
        from: user,
        to: newuser,
        subject: `Olá ${nome}, Bem Vindo ao EuLegal`,
        text: `
Caro(a) Senhor(a)

Aqui está mais informações de sua manisfestação de interesse:

ESTADO: ${acceptOrnot}
DATA DA MANISFESTAÇÃO: ${date}
PREVISÃO DE ACEITAÇÃO: ${aceptData}

______________________________________

Obs: Este dados são calculado de acordo com relatos de pessoas que estão passando pelo mesmo processo, portanto não é dados oficiais.

______________________________________`


        /* text: `Sua manisfestação realizada no dia ${date}, está prevista a ser aceita em: ${aceptData}, 
Manisfestação: ${acceptOrnot}
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
/* export async function notAccept (accept) {
    const response = accept.toString();

    if(response === 'Aceita', 'aceita') {
        console.log('Manisfestação Aceita')
    }else {
        console.log('Manisfestação Não Aceita')
    }

    console.log(response);
}
 */
