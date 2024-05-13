let {Router} = require(`express`);
let request = require('request'); // Модуль для скрапинга новостной страницы
let cheerio = require(`cheerio`); // Модуль для возспроизведения DOM на бекенде
let weather = require(`weather-js`); // Модуль для получения текущей погоды
let Day = require(`../models/day`); // Модель создаваемого дня
let Prot = require(`../middleware/protectSession`); // Проверка пользователя на актуальность сессии
let NodeRSA = require('node-rsa'); // Модуль для шифрования записей



let router = Router();



//! Загрузка записей на главную страницу
router.get(`/`, Prot, async (req,res) =>{

  let day;
  let degree;
  let weathers;
  let town;

  //! Берем последние 30 дней из базы данных, но если нету 30 дней тогда загружаем 
  //! столько сколько есть
  let deb = await Day.findById(req.session.user._id) //req.session.user.writes;

  // ОБЕКТ С ПРИВАТНЫМ И ПУБЛИЧЬНЫМ КЛЮЧЕМ 
  let key = new NodeRSA(deb.key); // Беру ключь из базы данных


  
  let Days = []; 
  let maxDay = 31; // Количество дней загружаемых при загрузке страницы

  if(deb.writes.length !== 0, deb.writes.length >= maxDay){
    for(let i = deb.writes.length - maxDay; i < deb.writes.length; i++){
      //* РАЗШИФРОВКА ЗАГОЛОВКА
      deb.writes[i].title = key.decrypt(deb.writes[i].title, `utf8`); 
      //* РАЗШИФРОВКА ОПИСАНИЯ
      deb.writes[i].description = key.decrypt(deb.writes[i].description, `utf8`);      
      Days.push(deb.writes[i]);
      
    }
  } else if(deb.writes.length < maxDay){
    for(let i = 0; i < deb.writes.length; i++){
      // console.log(deb.writes[i].title)
      //* РАЗШИФРОВКА ЗАГОЛОВКА
      deb.writes[i].title = key.decrypt(deb.writes[i].title, `utf8`); 
      //* РАЗШИФРОВКА ОПИСАНИЯ
      deb.writes[i].description = key.decrypt(deb.writes[i].description, `utf8`);
      Days.push(deb.writes[i]);
      
    }
  }


  
  

  function getWeather(){
    weather.find({search: 'Ukraine, Kyiv', degreeType: 'C'}, function(err, result) {
      
      // Тестовая проверка на то что оно не будет записывать данные в переменную
      // если не будет данных которые записывать
      if( typeof(result[0].current.day) == `string`){
        day = result[0].current.day;
        degree = result[0].current.temperature;
        weathers = result[0].current.skytext;
        town = result[0].current.observationpoint;
      }


    });	  
  }


    //! Запрашываем данные о погоде
    // ЗДЕСЬ Я ОТКЛЮЧИЛ ПОГОДУ ТАК КАК ОНА НАЧАЛА ВООБЩЕ НИКАКИХ ДАННЫХ НЕ ПРИСИЛАТЬ
//     await getWeather();

    if(day == undefined){
      day = `Не загрузилось`;
      degree = `Не загрузилось`;
      weathers = `Не загрузилось`;
      town = `Не загрузилось`;
    }


    //! Устанавливаю текущий день
    function month(){
      // Здесь додаем единичку так как реальный месяц показивает прошлым а не 
      // теперешним, а в базе данных записан теперешний месяц. Если 
      // мы не добавим единицу к текущему месяцу то получим прошлый месяц 
      // а не сегодняшний.
      if(`${Number(new Date().getMonth().toString()) + 1}`.length < 2){
        return `0` + (new Date().getMonth()+1);
      } else {
        return new Date().getMonth()+1;
      }
    }
  
    function dey(){
      if(`${new Date().getDate().toString()}`.length < 2){
        return `0` + new Date().getDate();
      } else {
        return new Date().getDate();
      }
    }    


    //* Сегодняшний день нахожу в базе данных и записываю туда ключь today
    //* спомощю которого handelbars у себя распознает что это он
    let today;

if(Days.length !== 0){
  // console.log(`${dey()}.${month()}.${new Date().getFullYear()}`);
  // today = await Day.findOne({create: `${dey()}.${month()}.${new Date().getFullYear()}`});
  today =   await Day.findOne(
    { _id : req.session.user._id },
    { writes : {$elemMatch : { create: `${dey()}.${month()}.${new Date().getFullYear()}`}} } 
 );



  if(today.writes.length !== 0){
    today.writes[0].today = true;
    await today.save(); // Сохраняю измененный день из базы данных
    
    //req.session.user.writes = today.writes;
    // console.log(today.writes[0].today);
    // await today.save();
    // await req.session.save();
  }
  
}






if(Days.length !== 0){
if(today.writes.length !== 0){
    //! Устанавливаю надпись для текущего дня если он пустой
    function checkText(){
      
      if(key.decrypt(today.writes[0].title, `utf-8`) == `Пустая запись в дневнике`){
        return true
      } else {
        return false
      }
    }    
 
    if(checkText()){
      today.writes[0].noneText = true;
      await today.save();
    }
}
}








      //! Проверка на валидность сегодняшнего дня, если нет то уберу лишний
      for(let elem of Days){
        
        // Выбираем елементы с ключом today который равняеться true
        if(elem.today == true){
         
          // Если дата сегодняшнего дня не совпадает с датой обекта то убираем сегодняший день
          if(elem.create !== `${dey()}.${month()}.${new Date().getFullYear()}`){
            elem.today = false;
            elem.noneText = false;
          }
        }
      }










 // Массив текста статти
 let mesText = [];
 // Массив ссылок
 let mesHref = [];
 // Вместе смешанный текст и ссылки
 let fresh = [];



 //! Со скрапчиваю данные из новостного сайта и записываю в массивы
 /* ЭТО РАСКОМЕНТИРОВАТЬ НУЖНО ЕСЛИ ПАРСИНГ ИЗ САЙТА НОВОСТЕЙ ВРУБАТЬ
 await request(`https://www.ferra.ru/`, function (err,bem,body){
   let $ = cheerio.load(body);

   
   $('.headline').each( (i, element) => { 
     mesText.push($(element).text());
   }); 

   $('.block a').each( (i, element) => {
     var link = $(element).attr('href');
     if(i == 0 || i == 13){
       mesHref.push(`https://www.ferra.ru`+link);
     }
  });
  */
  

  // Цикло создаю два обекта с ссылками на статтю на сайте и информацией о статте
  for(let i = 0; i < 2; i++){
   fresh.push({
     text: mesText[i],
     href: mesHref[i],
   })

   // Ставлю одному из обектов ключь img true чтоб на клиенте установить ему другую иконку
   if(i == 1){
     fresh[1].img = true
   }
  }

  






  
   
   //! Передаю все данные на Handelbars
   res.render(`index`, {
     title: `Зашифрованный электронный дневник`,
     fresh,
     day,
     degree,
     weathers,
     town,
     Days,
     normal: `normal`,
     cool: `cool`

   })

 })    





 
// ЭТО РАСКОМЕНТИРОВАТЬ НУЖНО ЕСЛИ ПАРСИНГ ИЗ САЙТТА НОВОСТЕЙ ВРУБАТЬ
// })

router.get(`/kek`, function (req,res){
  res.send(JSON.stringify(`Асждатьб менгя дано лишж богу`))
})

module.exports = router;