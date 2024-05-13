let {Router} = require(`express`);
let Day = require(`../models/day`); // Модель каждого дня
let Time = require(`../public/time`);
let Prot = require(`../middleware/protectSession`);
let NodeRSA = require('node-rsa'); // Модуль для шифрования записей

let router = Router();



//! Форма для создания записи
router.post(`/day`, Prot, async (req,res)=>{


  let Accoutn = await Day.findOne({_id: req.session.user._id});
  let key = new NodeRSA(Accoutn.key); // Создаю новый ключь 512 бит
  req.body.title = key.encrypt(req.body.title, 'base64');
  req.body.description = key.encrypt(req.body.description, 'base64');
  // req.body.title = key.decrypt(req.body.title, `utf8`);
  
 
  
  

  
  Accoutn.writes.push({
    create: Time(),
    title: req.body.title,
    time: req.body.time,
    smile: req.body.smile,
    description: req.body.description,
    generate: false,
    today: false,
    dayoff: checkDate(`${Time()}`) 
  })

  await Accoutn.save();

  req.session.user = Accoutn;
  await req.session.save();
  

  //! Проверка на то выходной ли день или нет
  function checkDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    // Подставляет нужную нам дату
    const date = new Date(year, month - 1, day);
    let dayoff; // Переменная которая примит в себя  СБ или НД
    console.log(date.getDay());
    if(date.getDay() == 6){
      dayoff = `СБ`;
    } else if(date.getDay() == 0){
      dayoff = `НД`;
    } 

    // Если сегодня не субота и не ниделя то просто значения undefined отправиться
    // для записи в базу, но база не запишет его так как именно ключь dayoff принимает
    // строку
    return dayoff;

  }


  res.redirect(`/`);

})

module.exports = router;