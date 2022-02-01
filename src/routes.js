import { Router } from "express";
import { createTable, insertPessoa, updatePessoa, selectPessoas, selectPessoa, deletePessoa, sendUser} from './Controler/Pessoa.js';




const router = Router();


/* router.get('/', (req, res)=>{
    res.json({
        "statusCode": 200,
        "msg": "Api Rodando"
    })
}) */
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