import { Group, Todo } from './classes.js';
import { checkCompleted, eachArr, firstLaunch, render, renderTodo, save, showPanel, trigger } from './functions.js';

/** Загрузить список задач с localstorage */
function load() {
  let storageGroup = JSON.parse(localStorage.getItem('todoGroup'))

  if (storageGroup === null) {
    firstLaunch();
    storageGroup = [];
  }

  renderGroupTodo(storageGroup)
  const baseDiv = document.getElementById('base');
  const todoListNow = JSON.parse(localStorage.getItem('todoNow')) || 0;

  if (!todoListNow || todoListNow.length === 0) {
    const text = document.createElement('div');
    text.classList.add('NoTodo');
    text.id = 'noTodo';
    text.textContent = 'Откройте меню и выберите задачу';
    baseDiv.appendChild(text);
  } else {
    const idGroup = todoListNow[0].idGroup;
    renderTodo(idGroup, todoListNow);
  }
}

/** Рендер месторасположения для групп задач  */
function renderGroupTodo(localstorageGroup) {
  menu();
  const groupListDiv = document.createElement('div');
  groupListDiv.classList.add('groupList', 'slide');
  groupListDiv.id = 'menu'
  document.body.appendChild(groupListDiv);

  const toGroupDiv = document.createElement('div');
  toGroupDiv.id = 'toGroup'
  toGroupDiv.classList.add('toGroup');
  groupListDiv.appendChild(toGroupDiv);

  if (localstorageGroup.length) renderGroupContent();
  renderPanelControl(groupListDiv, 'groupPanel', 'Group')
}


/** Вывод содержимого меню с группой задач */
function renderGroupContent() {
  /** Массив с объектами задач */
  const todoGroup = JSON.parse(localStorage.getItem('todoGroup'));

  const toGroupDiv = document.getElementById('toGroup');
  toGroupDiv.innerHTML = null;

  todoGroup.forEach((todo) => {

    // Создание места для каждой группы задач
    const groupTodoDiv = document.createElement('div');
    groupTodoDiv.classList.add('todoGroup');
    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel');
    toGroupDiv.appendChild(groupTodoDiv);
    toGroupDiv.appendChild(panelDiv);

    // Создание и настройка каждого элемента группы задач
    const elem = new Group(todo.text, todo.tags, todo.completedGroup, todo.idTodo);
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.completedGroup;
    check.addEventListener('change', () => {checkCompleted(todo.completedGroup, elem)})
    check.classList.add('checkComplete');
    const textDiv = document.createElement('div');
    textDiv.textContent = elem.text;
    textDiv.setAttribute('todo', elem.idTodo);
    textDiv.addEventListener('click', render)
    const checkShow = document.createElement('input');
    checkShow.type = 'checkbox';
    checkShow.classList.add('checkShow');
    groupTodoDiv.appendChild(check);
    groupTodoDiv.appendChild(textDiv)
    groupTodoDiv.appendChild(checkShow)

    // Создание дополнительных кнопок опций
    const changeButton = document.createElement('button');
    changeButton.textContent = '✏';
    changeButton.addEventListener('click', () => { trigger.changeTodo('text', elem) })
    const removeButton = document.createElement('button');
    removeButton.textContent = '🗑';
    removeButton.addEventListener('click', () => { trigger.deleteTodo(elem) })
    panelDiv.appendChild(changeButton);
    panelDiv.appendChild(removeButton);

    // Проверка присутствия ключа в localStorage
    const checkValueStorage = JSON.parse(localStorage.getItem(`todo${elem.idTodo}`));
    if (checkValueStorage === null) localStorage.setItem(`todo${elem.idTodo}`, JSON.stringify([]));

  })
}

/** Прорисовка список выбранных задач */
function detailRenderTodo(todoArray, numIdGroup, todoListDiv, parentTodo = []) {
  todoListDiv.innerHTML = null;
  const listUl = document.createElement('ul');
  listUl.classList.add('todoUl')
  todoListDiv.appendChild(listUl);

  todoArray.forEach((elem, index) => {
    const todo = new Todo(numIdGroup, parentTodo, index, elem.todo, elem.text, elem.tags, elem.completedTodo, elem.idTodo);

    const todoLi = document.createElement('li');
    todoLi.classList.add('mainTodo');
    listUl.appendChild(todoLi);

    const completeInput = document.createElement('input');
    completeInput.type = 'checkbox';
    completeInput.checked = todo.completedTodo;
    completeInput.addEventListener('change', () => { checkCompleted(completeInput.checked, todo) })
    completeInput.classList.add('completeCheck')
    const textTodoDiv = document.createElement('div');
    textTodoDiv.textContent = todo.text;
    textTodoDiv.classList.add('textTodo');
    const todoLengthDiv = document.createElement('div');
    todoLengthDiv.classList.add('todoLength');

    const additionalMenuInput = document.createElement('input');
    additionalMenuInput.type = 'checkbox';
    additionalMenuInput.id = 'menuShow';
    additionalMenuInput.classList.add('menuShow');
    const nextTodoInput = document.createElement('input');
    nextTodoInput.type = 'checkbox';
    nextTodoInput.id = 'nextTodoShow';
    nextTodoInput.classList.add('nextTodoShow', 'hide');
    const additionalMenuDiv = document.createElement('div');
    additionalMenuDiv.id = 'additionalMenu';
    additionalMenuDiv.classList.add('additionalMenu');
    const nextTodoDiv = document.createElement('div');
    nextTodoDiv.id = 'SecondaryTodo';
    nextTodoDiv.classList.add('SecondaryTodo');

    todoLi.appendChild(completeInput);
    todoLi.appendChild(textTodoDiv);
    todoLi.appendChild(todoLengthDiv);
    todoLi.appendChild(additionalMenuInput);
    todoLi.appendChild(additionalMenuDiv);
    todoLi.appendChild(nextTodoInput);
    todoLi.appendChild(nextTodoDiv);

    const addTodoButton = document.createElement('button');
    addTodoButton.classList.add('button', 'addTodo');
    addTodoButton.textContent = '➕';
    addTodoButton.addEventListener('click', () => { trigger.addWithTodo(todo, parentTodo, index) });
    const changeTodoButton = document.createElement('button');
    changeTodoButton.classList.add('button', 'changeTodo');
    changeTodoButton.textContent = '✏'
    changeTodoButton.addEventListener('click', () => { trigger.changeTodo('text', todo) });
    const deleteTodoButton = document.createElement('button');
    deleteTodoButton.classList.add('button', 'deleteTodo');
    deleteTodoButton.textContent = '🗑'
    deleteTodoButton.addEventListener('click', () => { trigger.deleteTodo(todo, parentTodo) });

    additionalMenuDiv.appendChild(addTodoButton);
    additionalMenuDiv.appendChild(changeTodoButton);
    additionalMenuDiv.appendChild(deleteTodoButton);

    // Проверка на дополнительные задачи и показ их количества с выполенными задачами
    if (todo.todo.length > 0) {
      const storageNow = JSON.parse(localStorage.getItem('todoNow'));

      nextTodoInput.classList.remove('hide');
      const arrMap = todo.todo.map(value => value.completedTodo);
      const arrComplete = arrMap.filter(value => value === true);
      todoLengthDiv.textContent = `${arrComplete.length}\\${arrMap.length}`;

      detailRenderTodo(todo.todo, numIdGroup, nextTodoDiv, todo);
    }
  })
}

/** Вывод панели управления */
function renderPanelControl(nodeElement, idElement, idGroupTodo) {
  const panelControlDiv = document.createElement('div');
  panelControlDiv.classList.add('panelControl');
  panelControlDiv.id = idElement;
  nodeElement.appendChild(panelControlDiv);

  const button = [
    {
      textContent: '➕',
      classList: 'button',
      event: () => { trigger.addGroup(idElement, idGroupTodo) },
    },
    {
      textContent: '🗑',
      classList: 'button',
      event: () => { trigger.deleteGroup(idElement, idGroupTodo) },
    },
    {
      textContent: '❌',
      classList: 'button',
      event: () => { trigger.clearAllGroup(idElement, idGroupTodo) }
    },
  ]

  button.forEach(elem => {
    const but = document.createElement('button');
    but.textContent = elem.textContent;
    but.classList.add(elem.classList);
    but.addEventListener('click', elem.event)
    panelControlDiv.appendChild(but)
  })
}

/** Рендер основного местоположения всех задач и кнопки меню */
function menu() {
  const baseDiv = document.createElement('div')
  baseDiv.classList.add('base');
  baseDiv.id = 'base'
  document.body.appendChild(baseDiv);
  const todoList = document.createElement('div')
  todoList.classList.add('todoList');
  todoList.id = 'todoList';

  const menuButton = document.createElement('button');
  menuButton.classList.add('button', 'menu', 'slide');
  menuButton.id = 'menuButton';
  menuButton.textContent = '⇶'
  menuButton.addEventListener('click', showPanel)
  baseDiv.appendChild(menuButton);
  baseDiv.appendChild(todoList)
}

load();

export { detailRenderTodo, renderPanelControl, renderGroupContent }