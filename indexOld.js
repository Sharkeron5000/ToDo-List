// Пример задач.
const JS = [[
  { completedToDo: false, textToDo: 'Список 1' }, { completedToDo: true, textToDo: 'Задача 1' }, { completedToDo: false, textToDo: 'Задача 2' }
],
[
  { completedToDo: true, textToDo: 'Список 2' }, { completedToDo: true, textToDo: 'Задача 1' }, { completedToDo: true, textToDo: 'Задача 2' }
]]
// localStorage.setItem('toDo', JSON.stringify(JS));

// Список задач, который заполнится с localStorage
const toDoList = [];

// Добавления места появления новых задач.
const toDo = document.createElement('div');
toDo.classList.add('to-do-list');
document.body.appendChild(toDo);

// Добавление элементов управления задачами
const panel = document.createElement('div');
panel.classList.add('panel-control');

// Кнопка добавления общей задачи
const buttonAdd = document.createElement('button');
buttonAdd.textContent = '➕';
buttonAdd.addEventListener('click', () => { createToDo() });
panel.appendChild(buttonAdd);

// Кнопка удаления выполненных задач
const buttonDelete = document.createElement('button');
buttonDelete.textContent = '🗑';
buttonDelete.addEventListener('click', () => { deleteToDo() });
panel.appendChild(buttonDelete);

// Кнопка удаления всех задач.
const buttonClear = document.createElement('button');
buttonClear.textContent = '❌';
buttonClear.addEventListener('click', () => { clearAllToDo() });
panel.appendChild(buttonClear);
document.body.appendChild(panel);

load();

// Сохранение всех задач в localStorage
function save() {
  localStorage.setItem('toDo', JSON.stringify(toDoList));
}

// Загрузка всех доступных задач c localStorage
function load() {
  const data = JSON.parse(localStorage.getItem('toDo') || '[]');
  toDoList.splice(0, toDoList.length, ...data);
  renderToDoList();
  console.log(data); // ВРЕМЕННО
}

// Вывод всех задач на экран
function renderToDoList() {
  toDo.textContent = '';
  let toDoNumberCompleted = ``;
  toDoList.forEach((elemToDo, idxToDo) => {
    // Создание заголовка для задачи
    const divElement = document.createElement('div');
    divElement.classList.add('to-do');
    // Место для подзадач
    const placeUl = document.createElement('ul');
    placeUl.id = idxToDo;
    elemToDo.forEach((elem, idx, arr) => {
      console.log(elem, idx, arr);
      // Кнопка выполнения
      const inputCheck = document.createElement('input');
      inputCheck.type = 'checkbox';
      inputCheck.checked = elem.completedToDo;
      inputCheck.addEventListener('input', () => { check(idxToDo, idx, inputCheck.checked) });
      // Title
      const nameHeaderToDo = document.createElement('div');
      if(!idx) {
        arr.filter((elem) => {
          console.log(elem);
        })
        toDoNumberCompleted = `${2}/${arr.length - 1}`
        nameHeaderToDo.textContent = `${elem.textToDo} ${toDoNumberCompleted}`;
      } else {
        nameHeaderToDo.textContent = elem.textToDo;
      }
      nameHeaderToDo.title = elem.textToDo;
      // Кнопка добавление новых задач
      const buttonAddToDo = document.createElement('button');
      buttonAddToDo.textContent = '➕';
      buttonAddToDo.addEventListener('click', () => { createToDo(idxToDo) })
      //Кнопка редактирования Title у заголовка
      const buttonEditTitle = document.createElement('button');
      buttonEditTitle.textContent = '✏';
      buttonEditTitle.addEventListener('click', () => { edit(idxToDo, idx) });
      // Кнопка удаления выбранного заголовка
      const buttonDeleteToDo = document.createElement('button');
      buttonDeleteToDo.textContent = '🗑';
      buttonDeleteToDo.addEventListener('click', () => { deleteToDo(idxToDo, idx) })
      // Кнопка показа задач у заголовка
      const buttonShowToDo = document.createElement('button');
      buttonShowToDo.textContent = '🔻';
      buttonShowToDo.addEventListener('click', () => { showToDo(idxToDo) })
      // Добавление всех элементов на экран
      // Добавление заголовка
      if (!idx) {
        toDo.appendChild(inputCheck);
        toDo.appendChild(nameHeaderToDo);
        toDo.appendChild(buttonAddToDo);
        toDo.appendChild(buttonEditTitle);
        toDo.appendChild(buttonDeleteToDo);
        toDo.appendChild(buttonShowToDo);
        toDo.appendChild(placeUl);
      }
      // Добавление подзадач
      if (idx) {
        const liToDo = document.createElement('li');
        liToDo.appendChild(inputCheck);
        liToDo.appendChild(nameHeaderToDo);
        liToDo.appendChild(buttonEditTitle);
        liToDo.appendChild(buttonDeleteToDo);
        placeUl.appendChild(liToDo);
      }

    })
  })
}

// Удаление всех заголовок
function clearAllToDo() {
  localStorage.clear();
  load();
}

// Редактирование состояние задач
function check(idxToDo, idx, check) {
  toDoList[idxToDo][idx].completedToDo = check;
  // Проверка заголовка и установка готовности/неготовности для подзадач
  if (idx === 0) {
    toDoList[idxToDo].forEach(i => i.completedToDo = check)
  }
  // Проверка подзадач и установка готовности/неготовки у заголовка
  if (idx !== 0) {
    toDoList[idxToDo][0].completedToDo = toDoList[idxToDo].every((i, idx) => {
      if(!idx) return true;
      return i.completedToDo;
    })
  }
  save();
  renderToDoList()
}

// Добавление задачи и  подзадачи
function createToDo(idxToDo) {
  const item = {
    completedToDo: false,
    textToDo: ''
  };

  if(!arguments.length){
    toDoList.push([item]);
    edit(toDoList.length - 1, 0);
  }
  if(arguments.length){
    toDoList[idxToDo].push(item);
    edit(idxToDo,toDoList[idxToDo].length-1);
  }
}

// Редактирование Title у задач
function edit(idxToDo, idx) {
  toDoList[idxToDo][idx].textToDo = prompt('Ввведите новую задачу', toDoList[idxToDo][idx].textToDo);
  save();
  renderToDoList();
}

// Удаление заголовки и подзадач
function deleteToDo(idxToDo, idx) {
  if(!arguments.length) toDoList.splice(0, toDoList.length, ...toDoList.filter(elem => !elem[0].completedToDo));
  if(!idx) toDoList.splice(idxToDo, 1);
  if(idx) toDoList[idxToDo].splice(idx, 1);
  save();
  renderToDoList();
}

// Показать/скрыть подзадачи
function showToDo(idxToDo) {
  document.getElementById(idxToDo).classList.toggle('show');
}