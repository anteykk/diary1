let {Router} = require(`express`);
let Days = require(`../models/day`);
let NodeRSA = require(`node-rsa`); // Шифрования записей

let router = Router();

//! Генерация оставшихся дней в месяце
router.get(`/`, async(req,res)=>{

  // Метод вычисляющий количество дней в этом месяце
  Date.prototype.daysInMonth = function() {
		return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
	};  

    let meaning = await Days.findOne(
      { _id : req.session.user._id }
   );
   
    let Smeaning = meaning.writes.length;

    let Day;
    let nowDay;

if(Smeaning){
  Day = await Days.findOne({
    _id: req.session.user._id
  });
 
  //* Последний день в базе данных
  // nowDay = Number(Day[Day.length - 1].create.split('.')[0]);  
  nowDay = Number(Day.writes[Day.writes.length - 1].create.split('.')[0]);

} else {
  Day = 0;
  nowDay = 0;
}


  //* Количество дней в этом месяце
  let Allday = Number(new Date().daysInMonth());
  //* Текущий месяц
  let nowMonth = function(){
    if(String(Number(new Date().getMonth()) + 1).length < 2){
      return `0` + ((Number(new Date().getMonth()) + 1));
    } else {
      return Number(new Date().getMonth()) + 1;
    }
  }

  
  //* Создания дней в базе данных
  nowDay++;


  let kek = await Days.findOne({_id: req.session.user._id});
  let key = new NodeRSA(kek.key);

  
  for(let i = nowDay; i <= Allday; i++){
    //console.log(new Date(`2021-${nowDay}-${nowMonth}`))
    let d = function(i){
      if(String(i).length < 2){
        return `0` + i;
      } else {
        return i;
      }
    }



    // `Not found 404`
    // `Вставьте сюда описания вашего дня`
    kek.writes.push({
      create: `${d(i)}.${nowMonth()}.2024`,
      title: key.encrypt(`Пустая запись в дневнике`, 'base64'),
      time: `00:00`,
      smile: `default`,
      description: key.encrypt(`Вставьте сюда описания вашего дня`, 'base64'),
      generate: true,
      today: false,
      dayoff: checkDate(`${d(i)}.${nowMonth()}.2024`)       
    })
    
    await kek.save();
   

    



  }


  //! Проверка на то выходной ли день или нет
  function checkDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    // Подставляет нужную нам дату
    const date = new Date(year, month - 1, day);
    let dayoff; // Переменная которая примит в себя  СБ или НД

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

