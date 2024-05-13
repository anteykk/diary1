
/*
for(let elem of edit){
  elem.addEventListener(`click`, ()=>{
    elem.offsetParent.children[3].style.display = `block`;
    elem.style.display = `none`;
  })
}
*/

// let width = screen.width;




window.addEventListener(`click`, (event)=>{

      // Переменная path есть не по всех браузерах ккак и composedPath, поэтому тут я проверяю какой метод есть в текущего браузера
      var path = event.path || (event.composedPath && event.composedPath());


  if(event.target.className == `far fa-edit`){
    console.dir(path[2].children[3].style.display = `flex`);
  }

})



