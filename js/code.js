
const symbol_colors = [
  "is-primary",
  "is-info",
  "is-link",
  "is-warning",
  "is-success",
  "is-danger",
  "is-primary is-light is-outlined",
  "is-link is-light is-outlined",
  "is-success is-light is-outlined",
]; // набор стилей из bulma, для кнопок
// объект в котором уровни игры представлены массивами
const level_info = [
  {
    symbols: ["j","f","k","d"," "],
  },
  {
    symbols: ["f","d","s"," ","j","k","l"],
  },
  {
    symbols: ["v","i","d"," ","c","e","f"],
  },
  {
    symbols: ["x","s","w"," ","n","k","o"],
  },
  {
    symbols: ["z","a","q"," ","m","l","p"],
  },
  {
    symbols: ["b","g","t"," ","n", "h","u"],
  },
];

//получаем музыку которая нужна
var number_of_level = 0; // задаем начальное значение
var error_sound = new Audio("sounds/error_sound.mp3"); //не правильная буква
var fail_sound = new Audio("sounds/fail_sound.mp3"); // Game over
var press_sound = new Audio("sounds/press_sound.mp3"); //звук при нажатии на правильную букву
var succes_sound = new Audio("sounds/success_sound.mp3"); // звук прохождения игры
var main_theme = new Audio("sounds/Main_theme.mp3"); //звук во время игры


var modal = document.querySelector(".modal"); //модальное окно, которое у нас появляется в конце игры, чтобы продемонстрировать нам результаты
var target_error = document.querySelector(".target_error"); //ряд в таблице кол-ва ошибок 
var error_panel = document.querySelector(".error-panel"); // панель, в которую мы будем добалять значениепри ошибке
var begin = document.querySelector(".begin"); // здесь у нас надпись, которая приглашает пользователя нажать enter для начала игры. Потом она у нас должна пропасть
var progress = document.getElementById("prog"); // здесь прогресс ошибок пользователя
var buttons = document.querySelector(".buttons"); // кнопки для букв
var modal_close = document.querySelector(".modal-close"); //(Х) закрывает модальное окно

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)); // функция для сбора букв в уровне рандомно 
}

//теперь нужно отрисовать наши буковки

document.addEventListener("keyup", StartGame, {
  once: true, //после одного нажатия удалется слушатель отрисовка один раз благодаря once
});

function StartGame(e) {
  
  if (e.key = "Enter") {
    error_panel.classList.remove("is-hidden"); // показываем панель ошибок сверху
    press_sound.play();
    begin.remove();
    mainGame(); //запуск функции основной игры

  }

  function drawBoard(info) {
    main_theme.play(); // запускаем основной саундтрек игры
    let str_arr = level_info[number_of_level].symbols; // какие буквы рисовать
    let col_arr = symbol_colors; //цвет кнопки для букв

    for (let i = 0; i < 10; i++) {
      let rand = getRandomInt(str_arr.length); //получаем случайные буквы до 10 штук для отрисовки

      buttons.insertAdjacentHTML(
        "afterbegin", //после отработки бегин отрисовываем кнопки
        `<button class="game-button button is-large ${col_arr[rand]}" id='${str_arr[rand]}'> ${str_arr[rand]}  </button> ` //отрисовка букв в виде кнопок
      );
    }
  }

  function mainGame() { //логика игры
    drawBoard(level_info);
    document.addEventListener("keyup", press);
  }
  var all_try = 0;
  var errors_count = 0;
  var counts_right = 0;

  function press(e) {
    //получаем нагенерированный набор
    //после этого, если нажатая клавиши совпадает с нулевым элементом
    //удаляем его и прибавляем правильный ответ и играем звук и добавляем в общием попытки

    let elements_arr = document.querySelectorAll(".game-button"); // превращает в массив
    if (e.key == elements_arr[0].id) {
      elements_arr[0].remove();
      counts_right++;
      press_sound.play();
      all_try++;
    } else {
      errors_count++; // стетчик ошибок
      error_sound.play();
      progress.value = errors_count;
      if (errors_count > 10) { //кол-во макс ошибок
        main_theme.pause();
        fail_sound.play();
        setTimeout(() => { //таймер конца игры при неудаче для того что-бы отыграл трек
          window.location.reload();
        }, 3200);
      }
    }
    if (counts_right == 10) { //кол-во символов в уровне
      counts_right = 0;
      number_of_level++;
      if (number_of_level == 6) {  //кол-во уровней игры

        modal.classList.add("is-active"); //вызов модального окна
        showResult(target_error, errors_count);
        modal_close.onclick = () => {
          modal.classList.remove('is-active');
          window.location.reload();
        };
      }
      mainGame();
    }
  }


  function showResult(target_El, content) {
    
    localStorage.setItem(+new Date(), content); //функция для того, чтобы показывать результаты
    (function drawOnLoad() {
      succes_sound.play();
      
      let temp_arr = []; //создаем временный массив для размещения результатов
      for (let i = 0; i < localStorage.length; i++) {
        temp_arr.push(+localStorage.key(i));
      }
      temp_arr.sort(); // отсортировать массив результатов
      for (let i = 0; i < temp_arr.length; i++) {

        let item_time = new Date(temp_arr[i]);
        // получаем время прохождения игры
        target_El.insertAdjacentHTML(
          "afterend",
          `<th>${item_time.toLocaleString()}</th>
                <th> ${localStorage.getItem(String(temp_arr[i]))}</th>` //непосредственно отрисовка таблицы
        );
      }
    })();
  }
}




