let {Router} = require(`express`);
let {validationResult} = require(`express-validator/check`); // Результат валидации
let {registerValidators} = require(`../utils/validator`); // Сам скрипт валидации
let User = require(`../models/day`); // База данных пользователя с записями
let bcrypt = require(`bcrypt`);
let NodeRSA = require('node-rsa');

let router = Router();


//! Загрузка страницы регистрации
router.get(`/`, async (req,res)=>{
  res.render(`register`, {
    title: `Страница регистрации`,
    error: req.flash(`error`),
    succesful: req.flash(`succesful`)
  })
})

//! Форма для проверкии полей регистррации и сохранения пользователя в базу данных
router.post(`/`, registerValidators, async (req,res)=>{
  let key = new NodeRSA({b: 512}); // Екземпляр с 512 битным приватным и публичьным ключем


  // Переменная с ошыбкой если она есть
  let errors = validationResult(req); 

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    console.log(errors.array()[0].msg);
    res.redirect(`/register`);
    return;
  }  

  req.body.password = await bcrypt.hash(req.body.password, 10);

  await new User({
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    key: key.exportKey() // Записываю ключь шифровки и дешифровки в базу данных
  })
  .save()
  .then((s)=>{
    console.log(s);
  })

  
  req.flash(`succesful`, `Успешная регистрация пользователя`);
  res.redirect(`/`);
  console.log(`Прошло проверку`);
})

module.exports = router;