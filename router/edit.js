let {Router} = require(`express`);
let Days = require(`../models/day`);
let NodeRSA = require(`node-rsa`); // Модуль шифрования

let router = Router();


//! Редактирования уже созданной записи пользователя
router.post(`/:id`, async (req,res)=>{
  
  let Day = await Days.find(
    { _id : req.session.user._id },
    { writes : {$elemMatch : { _id: req.params.id}} }
 );


 let KeyDay = await Days.findOne({_id: req.session.user._id});
 let key = new NodeRSA(KeyDay.key); // Достаю публичьный и приватный ключь из базы данных
 req.body.title = key.encrypt(req.body.title, 'base64'); // Шифрую заголовок
 req.body.description = key.encrypt(req.body.description, `base64`); // Шифрую описания записи



 let id = Day[0].writes[0]._id;
 
 


await Days.updateOne(
  {
    _id: req.session.user._id,
    'writes._id': id,
    },
    {
    $set: {
     'writes.$.title': req.body.title,
     'writes.$.description': req.body.description,
     'writes.$.create': req.body.create,
     'writes.$.time': req.body.time,
     'writes.$.smile': req.body.smile,
     'writes.$.generate': false,
     'writes.$.noneText': false
    }
    }
 )
 

  res.redirect(`/loat`);
  
  



})

module.exports = router;