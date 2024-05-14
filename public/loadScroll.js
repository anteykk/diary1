let Space = document.querySelector(`.space`); // Общий новостной блок в котором блоки статтей


let staty = document.querySelectorAll(`.space__mini-block`).length;
let end = false;

Space.addEventListener("scroll", function(){ 
  let Space = document.querySelector(`.space`); // Общий новостной блок в котором блоки статтей

  let eGif = document.createElement(`div`);
  eGif.classList.add(`space__loading`);
  let eGifImg = document.createElement(`img`);
  eGifImg.src = `gifka.gif`;
  eGif.appendChild(eGifImg);
  let csrf = document.querySelector(`#data`);
  csrf = csrf.dataset.csrf; // csrf токен без которого сообщения на сервер не передасться
  

  if(Space.scrollTop == 0){
    
    if(!end){
      Space.prepend(eGif);
      fetch(`/load`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({staty: staty}),
        headers: {
            'X-XSRF-TOKEN': csrf,
            'content-type': 'application/json'
        }
        }).then((response)=>{
          // Разпарсиваем полученную JSON строку и передаем в следующий then
          Space.removeChild(eGif);
          return response.json()
        }).then((infa)=>{
          staty+=10;

          if(infa.end == true){
            end = true;
          }
          
          for(let elem of infa.goDay){
            // Пространство дней
            let Days = document.querySelector(`.space`);

            // Целый день
            let miniBlock = document.createElement(`div`);
            miniBlock.classList.add(`space__mini-block`);

            // Проверка на тип дня, типа среднего или уникального
            if(elem.smile == `normal`){
              miniBlock.classList.add(`normal`);
            } else if(elem.smile == `cool`){
              miniBlock.classList.add(`cool`);
            }

            if(elem.generate == true){
              miniBlock.classList.add(`generate`);
            }

            if(elem.dayoff){
              miniBlock.classList.add(`dayoff`);
            }
            
            // Верх блока
            let miniBlockTop = document.createElement(`div`);
            miniBlockTop.classList.add(`space__mini-block__top`);

            let TODAY = document.createElement(`div`);
            TODAY.classList.add(`sunday`);
            TODAY.innerHTML = elem.dayoff;

            let miniBlockTopDate = document.createElement(`div`);
            miniBlockTopDate.classList.add(`space__mini-block__top__date`);
            miniBlockTopDate.innerHTML = elem.create;
            
            let miniBlockTopInfo = document.createElement(`div`);
            miniBlockTopInfo.classList.add(`space__mini-block__top__info`);
            miniBlockTopInfo.innerHTML = elem.title;
            
            let miniBlockTopHours = document.createElement(`div`);
            miniBlockTopHours.classList.add(`space__mini-block__top__hours`);
            miniBlockTopHours.innerHTML = elem.time;
            
            miniBlockTop.appendChild(miniBlockTopDate);
            if(elem.dayoff){
              miniBlockTop.appendChild(TODAY);
            }
            miniBlockTop.appendChild(miniBlockTopInfo);
            miniBlockTop.appendChild(miniBlockTopHours);
            miniBlock.appendChild(miniBlockTop);

            // Низ блока
            let miniBlockHidden = document.createElement(`div`);
            miniBlockHidden.classList.add(`space__mini-block__hidden`);

            // Левая часть низа блока
            let miniBlockHiddenLeft = document.createElement(`div`);
            miniBlockHiddenLeft.classList.add(`space__mini-block__left`);

            let miniBlockHiddenLeftTitle = document.createElement(`div`);
            miniBlockHiddenLeftTitle.classList.add(`space__mini-block__left__title`);
            miniBlockHiddenLeftTitle.innerHTML = `ДНЕВНИК<br/> <span id="red">РАЗРАБОТЧИКА</span><br/> <span id="light">ANTEYKU</span>`;
            
            let miniBlockHiddenLeftLogo = document.createElement(`div`);
            miniBlockHiddenLeftLogo.classList.add(`space__mini-block__left__logo`);

            let miniBockHiddenLeftLogoImg = document.createElement(`img`);
            miniBockHiddenLeftLogoImg.src = `d3184d1b9008b98d2fc63143408b63f4.jpg`;

            miniBlockHiddenLeftLogo.appendChild(miniBockHiddenLeftLogoImg);
            miniBlockHiddenLeft.appendChild(miniBlockHiddenLeftTitle);
            miniBlockHiddenLeft.appendChild(miniBlockHiddenLeftLogo);
            miniBlockHidden.appendChild(miniBlockHiddenLeft);
            miniBlock.appendChild(miniBlockHidden);

            //Days.prepend(miniBlock);

            // Правая часть блока
            let miniBlockHiddenRight = document.createElement(`div`);
            miniBlockHiddenRight.classList.add(`space__mini-block__bottom`);

            let miniBlockHiddenDescription = document.createElement(`div`);
            miniBlockHiddenDescription.classList.add(`space__mini-block__bottom__description`);
            miniBlockHiddenDescription.innerHTML = elem.description;
            
            let miniBlockHiddenDescriptionImage = document.createElement(`div`);
            miniBlockHiddenDescriptionImage.classList.add(`space__mini-block__bottom__image`);

            let miniBlockHiddenDescriptionImageIMG = document.createElement(`img`);
            miniBlockHiddenDescriptionImageIMG.src = `простой день.jpg`;

            if(elem.smile == `normal`){
              miniBlockHiddenDescriptionImageIMG.src = `нормальный день.jpg`;
            } else if(elem.smile == `cool`){{
              miniBlockHiddenDescriptionImageIMG.src = `класный день.jpg`;
            }}

            let miniBlockHiddenRightLINKdelete = document.createElement(`a`);
            miniBlockHiddenRightLINKdelete.id = `delete`;
            miniBlockHiddenRightLINKdelete.href = `/delete/${elem._id}`;

            let miniBlockHiddenRightLINKdeleteI = document.createElement(`i`);
            miniBlockHiddenRightLINKdeleteI.classList.add(`fas`);
            miniBlockHiddenRightLINKdeleteI.classList.add(`fa-ban`);

            let miniBlockHiddenRightLINKedit = document.createElement(`div`);
            miniBlockHiddenRightLINKedit.id = `edit`;

            let miniBlockHiddenRightLINKeditI = document.createElement(`i`);
            miniBlockHiddenRightLINKeditI.classList.add(`far`);
            miniBlockHiddenRightLINKeditI.classList.add(`fa-edit`);            

            miniBlockHiddenRightLINKdelete.appendChild(miniBlockHiddenRightLINKdeleteI);
            miniBlockHiddenRightLINKedit.appendChild(miniBlockHiddenRightLINKeditI);
            miniBlockHiddenDescriptionImage.appendChild(miniBlockHiddenDescriptionImageIMG);
            miniBlockHiddenDescription.appendChild(miniBlockHiddenDescriptionImage);
            miniBlockHiddenRight.appendChild(miniBlockHiddenDescription);
            miniBlockHiddenRight.appendChild(miniBlockHiddenRightLINKdelete);
            miniBlockHiddenRight.appendChild(miniBlockHiddenRightLINKedit);
            miniBlockHidden.appendChild(miniBlockHiddenRight)

            

            // Админка для редактирования текущего товара
            let miniBlockAdminka = document.createElement(`div`);
            miniBlockAdminka.classList.add(`space__mini-block__adminka`);

            let miniBlockAdminkaForm = document.createElement(`form`);
            miniBlockAdminkaForm.action = `/edit/${elem._id}`;
            miniBlockAdminkaForm.method = `post`;
            
            let miniBlockAdminkaFormTitleEDIT = document.createElement(`div`);
            miniBlockAdminkaFormTitleEDIT.classList.add(`space__mini-block__adminka__edit`);
            miniBlockAdminkaFormTitleEDIT.innerHTML = `РЕДАКТИРВОАНИЯ ЗАПУСИ`;

            let miniBlockAdminkaFormTitle = document.createElement(`div`);
            miniBlockAdminkaFormTitle.classList.add(`space__mini-block__adminka__title`);
            miniBlockAdminkaFormTitle.innerHTML = `Заголовок`;

            let miniBlockAdminkaFormInputTITLE = document.createElement(`input`);
            miniBlockAdminkaFormInputTITLE.name = `title`;
            miniBlockAdminkaFormInputTITLE.type = `text`;
            miniBlockAdminkaFormInputTITLE.defaultValue = elem.title;
            

            let miniBlockAdminkaFormTitleTWO = document.createElement(`div`);
            miniBlockAdminkaFormTitleTWO.classList.add(`space__mini-block__adminka__title`);
            miniBlockAdminkaFormTitleTWO.innerHTML = `Время`;

            let miniBlockAdminkaFormInputTIME = document.createElement(`input`);
            miniBlockAdminkaFormInputTIME.name = `time`;
            miniBlockAdminkaFormInputTIME.type = `time`;
            miniBlockAdminkaFormInputTIME.defaultValue = elem.time; 
            
            let miniBlockAdminkaFormSelect = document.createElement(`select`);
            miniBlockAdminkaFormSelect.name = `smile`;
            miniBlockAdminkaFormSelect.value = `default`;
            miniBlockAdminkaFormSelect.defaultValue = `default`;
            

            let miniBlockAdminkaFormSelectDefault = document.createElement(`option`);
            miniBlockAdminkaFormSelectDefault.defaultValue = `default`;
            miniBlockAdminkaFormSelectDefault.value = `default`;
            miniBlockAdminkaFormSelectDefault.innerHTML = `Обыденность`;

            let miniBlockAdminkaFormSelectNormal = document.createElement(`option`);
            miniBlockAdminkaFormSelectNormal.defaultValue = `normal`;
            miniBlockAdminkaFormSelectNormal.value = `normal`;
            miniBlockAdminkaFormSelectNormal.innerHTML = `Не обыденность`;
      
            let miniBlockAdminkaFormSelectCool = document.createElement(`option`);
            miniBlockAdminkaFormSelectCool.defaultValue = `cool`;
            miniBlockAdminkaFormSelectCool.value = "cool";  
            miniBlockAdminkaFormSelectCool.innerHTML = `Уникальный`; 
            
            let miniBlockAdminkaFormTitleThree = document.createElement(`div`);
            miniBlockAdminkaFormTitleThree.classList.add(`space__mini-block__adminka__title`);
            miniBlockAdminkaFormTitleThree.innerHTML = `Описание`;
            
            let miniBlockAdminkaFormTextarea = document.createElement(`textarea`);
            miniBlockAdminkaFormTextarea.name = `description`;
            miniBlockAdminkaFormTextarea.placeholder = `Введите сюда описание дня`;
            miniBlockAdminkaFormTextarea.innerHTML = elem.description;
            miniBlockAdminkaFormTextarea.cols = 30;
            miniBlockAdminkaFormTextarea.rows = 10;

            let miniBlockAdminkaFormInputCREATE = document.createElement(`input`);
            miniBlockAdminkaFormInputCREATE.type = `hidden`;
            miniBlockAdminkaFormInputCREATE.name = `create`;
            miniBlockAdminkaFormInputCREATE.defaultValue = elem.create;

            // Елемент с csrf ключом
            let miniBlockAdminkaFormInputCSRF = document.createElement(`input`);
            miniBlockAdminkaFormInputCSRF.type = `hidden`;
            miniBlockAdminkaFormInputCSRF.name = `_csrf`;
            miniBlockAdminkaFormInputCSRF.defaultValue = csrf;

            let miniBlockAdminkaFormSUBMIT = document.createElement(`button`);
            miniBlockAdminkaFormSUBMIT.type = `submit`;
            miniBlockAdminkaFormSUBMIT.innerHTML = `Сохранить`;

            miniBlockAdminkaFormSelect.appendChild(miniBlockAdminkaFormSelectDefault);
            miniBlockAdminkaFormSelect.appendChild(miniBlockAdminkaFormSelectNormal);
            miniBlockAdminkaFormSelect.appendChild(miniBlockAdminkaFormSelectCool);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormTitleEDIT);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormTitle);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormInputTITLE);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormTitleTWO);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormInputTIME);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormSelect);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormTitleThree);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormTextarea);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormInputCREATE);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormInputCSRF);
            miniBlockAdminkaForm.appendChild(miniBlockAdminkaFormSUBMIT);
            miniBlockAdminka.appendChild(miniBlockAdminkaForm);
            miniBlockHiddenRight.appendChild(miniBlockAdminka);

            Days.prepend(miniBlock);
            console.log(Days);

           
            
          }

          // Прогрузка емодзи на новых днях
          emojify.run();

          


        })    
    }

  }
})



// Space.scrollTop  получения значения текущего скрола