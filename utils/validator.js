let {body} = require(`express-validator/check`);
let User = require(`../models/day`);

exports.registerValidators = [ // Валидация для формы регистрации
  body(`login`, `Минимальная длинна логина 6 символов, макс 40`)
  .isLength({min: 6, max: 40})
  .isAlphanumeric()
  .trim(),
  body(`password`, `Пароль не содержит минимум 6 символов`)
  .isLength({min: 6, max: 50})
  .isAlphanumeric()
  .trim(),
  body(`resetPassword`)
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error(`Пароли должны совпадать`);
    }

    return true
  }),
  body(`email`, `Email указан не верно`)
  .normalizeEmail()
  .isEmail() 
  .custom(async (value, {req})=>{

    let check = await User.findOne({email: value});

    if(check){
      return Promise.reject(`Аккаунт с таким email уже существует`);
    }

  })     
]


exports.authValidators = [ // Валидация для формы авторизации
  body(`email`, `Email указан не верно`)
  .normalizeEmail()
  .isEmail() 
  .custom(async (value, {req})=>{

    let check = await User.findOne({email: value});

    if(!check){
      return Promise.reject(`Аккаунт с таким email не существует`);
    }

  }),
  body(`password`, `Пароль не содержит минимум 6 символов`)
  .isLength({min: 6, max: 50})
  .isAlphanumeric()
  .trim(),
  body(`resetPassword`)
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error(`Пароли должны совпадать`);
    }

    return true
  })  

]