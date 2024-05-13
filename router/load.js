let {Router} = require(`express`);
let Days = require(`../models/day`);
let NodeRSA = require(`node-rsa`); // модуль для шифрования записей

let router = Router();

//! Запрос на подгружения доп дней из базы данных
router.post(`/`, async (req,res)=>{


  // Количество имеющихся дней додаем к количеству запрашуемых дней. (тем самым мы проверим имееться ли в базе данных такое количество дней)
  let getDay = req.body.staty + 10;
  // Все дни из базы данных
  let allDays = await Days.findOne({_id: req.session.user._id});
  let key = new NodeRSA(allDays.key); // Присваиваем ключь пораньше так как мы изменяем дальше переменную allDays
  allDays = allDays.writes;
  




  
  // Если в базе останеться меньше 30 дней то отправляться оставшиеся дни
  if(getDay > allDays.length){
    let remainder = 10 - (getDay - allDays.length);
    let goDay = [];
    for(let i = allDays.length - (allDays.length - remainder) - 1; i >= 0; i--){


     //* РАЗШИФРОВУЮ ЗАГОЛОВОК
     allDays[i].title = key.decrypt(allDays[i].title, `utf8`);
     //* РАЗШИФРОВУЮ ОПИСАНИЕ
     allDays[i].description = key.decrypt(allDays[i].description, `utf8`);
     
     goDay.push(allDays[i]);
    }
    res.send(JSON.stringify({goDay, end:true}));
    console.log(`Дней для подгрузки не хватает, последние вывожу`)
  } else { // Если в базе будет 30 дней то ани отпраавяться
    let remainer = allDays.length - getDay - 1; // 42 - 40 - 1 = 1;
    let goDay = [];

    // allDays.length - (getDay-9) Количество дней минус количество уже загруженых дней
    //* Единица мы отняли в i и remainer так как при загрузке одного дня не 
    //* досчитываюсь а там адин день лишний.
    // let i = 42 - (40-9); 13 > 1; 13--;




    for(let i = allDays.length - (getDay-9); i > remainer; i--){
      // 13,11,10,9... 4
      allDays[i].title = key.decrypt(allDays[i].title, `utf8`);
      allDays[i].description = key.decrypt(allDays[i].description, `utf8`);

      goDay.push(allDays[i])
    }


    
    res.send(JSON.stringify({goDay}));
  }

})

module.exports = router;