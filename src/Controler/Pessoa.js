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
        db.run('INSERT INTO users (name, email, contato, status, date, dataCadastro) VALUES (?,?,?,?,?,?)', [pessoa.name, pessoa.email, pessoa.contato, pessoa.status, pessoa.date, saveDate]);
    });
    res.redirect('/success');

    //let formatData = formatDate(moment(data));
    const stringDate = data;
    const date = new Date(stringDate);


    let acceptOrnot = status.toString();
    let aceita = 'Manisfestação Aceita';
    let notAceita = 'Manisfestação Não Aceita';
    
    //false = Aceita true= Não aceita
   const statusManisfestação = acceptOrnot.includes('Não') || acceptOrnot.includes('não');
    
    if(statusManisfestação == false) {
        var maniStatus = aceita;
        var marcaAceita = true;
        var dataStatus = date.setDate(date.getDate() + 102); //536
    } else {
        var maniStatus = notAceita
        var marcaAceita = false;
        var dataStatus = date.setDate(date.getDate() + 533); //536
    }

    
    sendUser(emailId, nameId, data, dataStatus, maniStatus, marcaAceita);

    
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
    const user = "news@eulegal.me";
    const pass = "Gustavoab007@";
    let newuser = email;
    let nome = name;
    let date = moment(data).format('DD/MM/YYYY');
    let aceptData = aceptDate;
    let acceptOrnot = accept;
    
    if (marcacao == true) {
        var aceitacao = 'MARCAÇÃO';
    } else {
        var aceitacao = 'ACEITAÇÃO';
    }
    

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
PREVISÃO DE ${aceitacao}: ${aceptData}

______________________________________

Obs: 
- Este dados são calculado de acordo com relatos de pessoas que estão passando pelo mesmo processo, portanto não são dados oficiais.

- Estamos ajudando centenas de pessoas, que estão a procura de informações sobre suas situações.

- Gostaria de apoiar esse projeto inovador:

- Siga-nós no Instagram - @eulegal.me https://www.instagram.com/eulegal.me/

- Entramos no Instagram a pouco tempo ajude-nós a chegar a 500 seguidores.

- Compartilhe com outras pessoas que estão aguardando por essas informações.
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

