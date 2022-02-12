import { Router } from "express";
import { insertPessoa, updatePessoa, selectPessoas, selectPessoa, deletePessoa, sendUser} from './Controler/Pessoa.js';
//import {allNames} from '../models/users.js';


const router = Router();

/* router.get('/newschema', (req, res)=>{
    const users = new allNames({
        name: 'Gustavo',
        email: 'gu@gmail.com'
    });
    users.save()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })
})  */


router.get('/', (req, res) => res.render('index.ejs'));
router.get('/subscribeSEF', (req, res) => res.render('index',{page: 'sefSubscribe'}))
router.get('/subscribeIMT', (req, res) => res.render('imtSubscribe'))
router.get('/success', (req, res) => res.render('success.ejs'));




router.get('/pessoas', selectPessoas);
router.get('/pessoa', selectPessoa);
router.post('/pessoa', insertPessoa);
router.get('/send', sendUser);
router.put('/pessoa', updatePessoa);
router.delete('/pessoa', deletePessoa);

export default router;