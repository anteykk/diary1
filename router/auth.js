let {Router} = require(`express`);
let {validationResult} = require(`express-validator/check`); // Результат валидации
let {authValidators} = require(`../utils/validator`); // Валидатия для формы авторизации
let bcrypt = require(`bcrypt`);
let User = require(`../models/day`);
let authProtect = require(`../middleware/protAuth`);

let router = Router();

//! Загрузка страницы авторизации
router.get(`/`, authProtect, async (req,res)=>{
  res.render(`auth`, {
    title: `Страница авторизации`,
    error: req.flash(`error`),
    succesful: req.flash(`succesful`)    
  })
})



//! Прием полей из страницы авторизации, и заход в аккаунт
router.post(`/auth`, authProtect, authValidators, async (req,res)=>{
  // Переменная с ошыбкой если она есть
  let errors = validationResult(req); 
  
  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    console.log(errors.array()[0].msg);
    res.redirect(`/`);
    return;
  }   
  
  let usePas = await User.findOne({email: req.body.email})
  let check = await bcrypt.compare(req.body.password, usePas.password);

  if(check){
    req.session.accept = true;
    req.session.user = usePas;
    await req.session.save();

    req.flash(`succesful`, `Успешная авторизация пользователя`);
    res.redirect(`/loat`);
    console.log(`Валидация прошла успешно.`);
  } else {
    req.flash(`error`, `Логин или Пароль введены неверно.`)
    res.redirect(`/`);
  }


})

module.exports = router;