let button = document.querySelector(`.add`);
let admAdd = document.querySelector(`.adminkaAdd`);

button.addEventListener(`click`, ()=>{
  button.style.display = `none`;
  admAdd.style.display = `flex`;
})