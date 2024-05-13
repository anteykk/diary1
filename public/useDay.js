

let space = document.querySelector(`.space`);


  space.addEventListener(`click`, (event)=>{
    // Это я определаю телефон ли это или desctop, поэтому яя проверяю
    // для того чтобе установить для телефонов block а для компа flex
    let width = screen.width;


    // Переменная path есть не по всех браузерах ккак и composedPath, поэтому тут я проверяю какой метод есть в текущего браузера
    var path = event.path || (event.composedPath && event.composedPath());

    if(width > 414){
        // Делааю две проверки так как в сегодняшнего дня другой стиль и он 
        // из за чего он не раскроет сегодняшний день как все остальные дни,
        // Поэтому я и пишу две проверки - первая для обичьных дней а вторая 
        // для сегодняшнего дня.
        
        // Открытия всех дней в которых нету (стиля сеггодняшнегодня)

       
    


        
        if(event.target.className == `space__mini-block__top__info ` || event.target.className == `space__mini-block__top__info`){
  
         
          
          if(getComputedStyle(path[2].children[1]).display == `none`){
            path[2].children[1].style.display = `flex`;
          } else if(getComputedStyle(path[2].children[1]).display !== `none`){
            path[2].children[1].style.display = `none`;
          }       
        
          

        }

        // Открытия всех тех дней в которых стоит span
        if(event.target.className == `space__mini-block__top__info-two` || event.target.className == `space__mini-block__top__info-two `){
          if(getComputedStyle(path[3].children[1]).display == `none`){
            path[3].children[1].style.display = `flex`;
          } else if(getComputedStyle(path[3].children[1]).display !== `none`){
            path[3].children[1].style.display = `none`;
          }
        }
      
        // Открытия сегодняшнего дня с новым стилем
        if(event.target.className == `space__mini-block__top__info today`){
          if(getComputedStyle(path[2].children[1]).display == `none`){
            path[2].children[1].style.display = `flex`;
          } else if (getComputedStyle(path[2].children[1]).display !== `none`){
            path[2].children[1].style.display = `none`;
          }
        }
    } else {
        // Делааю две проверки так как в сегодняшнего дня другой стиль и он 
        // из за чего он не раскроет сегодняшний день как все остальные дни,
        // Поэтому я и пишу две проверки - первая для обичьных дней а вторая 
        // для сегодняшнего дня.
        
        // Открытия всех дней в которых нету (стиля сеггодняшнегодня)
        if(event.target.className == `space__mini-block__top__info ` || event.target.className == `space__mini-block__top__info`){
          if(getComputedStyle(path[2].children[1]).display == `none`){
            path[2].children[1].style.display = `block`;
          } else if(getComputedStyle(path[2].children[1]).display !== `none`){
            path[2].children[1].style.display = `none`;
          }
        }
      
        // Открытия сегодняшнего дня с новым стилем
        if(event.target.className == `space__mini-block__top__info today`){
          if(getComputedStyle(path[2].children[1]).display == `none`){
            path[2].children[1].style.display = `block`;
          } else if (getComputedStyle(path[2].children[1]).display !== `none`){
            path[2].children[1].style.display = `none`;
          }
        }
    }


  
  })    
  


// При нажатии на середину дня мы выбираем дочерним елементом главнй блок на который нажали и 
// уже из главного блока выбираем второй скритый блок выбранного нами ддня и делаим его 
// видимым. Также стоит проверка ккоторая проверяет на точно нажатий нами среднийб блок 
// дня (ибо в ином случае будут пропадать не желатильные нам елементы)
/*
space.addEventListener(`click`, (event)=>{
  // Делааю две проверки так как в сегодняшнего дня другой стиль и он 
  // из за чего он не раскроет сегодняшний день как все остальные дни,
  // Поэтому я и пишу две проверки - первая для обичьных дней а вторая 
  // для сегодняшнего дня.
  
  // Открытия всех дней в которых нету (стиля сеггодняшнегодня)
  if(event.target.className == `space__mini-block__top__info ` || event.target.className == `space__mini-block__top__info`){
    if(getComputedStyle(event.path[2].children[1]).display == `none`){
      event.path[2].children[1].style.display = `flex`;
    } else if(getComputedStyle(event.path[2].children[1]).display !== `none`){
      event.path[2].children[1].style.display = `none`;
    }
  }

  // Открытия сегодняшнего дня с новым стилем
  if(event.target.className == `space__mini-block__top__info today`){
    if(getComputedStyle(event.path[2].children[1]).display == `none`){
      event.path[2].children[1].style.display = `flex`;
    } else if (getComputedStyle(event.path[2].children[1]).display !== `none`){
      event.path[2].children[1].style.display = `none`;
    }
  }

})
*/