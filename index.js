import { Group, Todo } from './classes.js';
import { checkCompleted, firstLaunch, render, renderTodo, show, showPanel, trigger } from './functions.js';

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
    const todoTip = document.createElement('div');
    todoTip.classList.add('noTodo');
    todoTip.id = 'noTodo';
    todoTip.textContent = 'Откройте меню нажав на ⇶ и выберите тему задач';
    baseDiv.appendChild(todoTip);
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
  if(!localstorageGroup.length) renderGroupTip();
  renderPanelControl(groupListDiv, 'groupPanel', 'Group')
}

function renderGroupTip() {
  const group = document.getElementById('toGroup');
  group.textContent = 'Тем задач не найдены, нажмите ➕ чтобы создать новые'
}


/** Вывод содержимого меню с группой задач */
function renderGroupContent() {
  /** Массив с объектами задач */
  const todoGroup = JSON.parse(localStorage.getItem('todoGroup'));

  const toGroupDiv = document.getElementById('toGroup');
  if(!todoGroup.length) return renderGroupTip()
  toGroupDiv.innerHTML = null;

  todoGroup.forEach((todo) => {

    // Создание места для каждой группы задач
    const groupTodoDiv = document.createElement('div');
    groupTodoDiv.classList.add('todoGroup');
    toGroupDiv.appendChild(groupTodoDiv);
    
    // Создание и настройка каждого элемента группы задач
    const elem = new Group(todo.text, todo.tags, todo.completed, todo.idTodo);
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.completed;
    check.addEventListener('change', () => { checkCompleted(check.checked, elem) })
    check.classList.add('checkComplete');
    const textDiv = document.createElement('div');
    textDiv.textContent = elem.text;
    textDiv.setAttribute('todo', elem.idTodo);
    textDiv.addEventListener('click', render);
    textDiv.classList.add('text');
    const showPanelButton = document.createElement('button');
    showPanelButton.classList.add('checkShow');
    showPanelButton.id = `showAdditionalPanel${elem.idTodo}`;
    showPanelButton.textContent = '...';
    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel', 'hide');
    panelDiv.id = `additionalPanelGroup${elem.idTodo}`
    showPanelButton.addEventListener('click', () => {show(showPanelButton.id, panelDiv.id)});
    groupTodoDiv.appendChild(check);
    groupTodoDiv.appendChild(textDiv);
    groupTodoDiv.appendChild(panelDiv);
    groupTodoDiv.appendChild(showPanelButton);
    
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
    const todo = new Todo(numIdGroup, parentTodo, index, elem.todo, elem.text, elem.tags, elem.completed, elem.show, elem.idTodo);

    const todoLi = document.createElement('li');
    todoLi.classList.add('mainTodo');
    listUl.appendChild(todoLi);

    const completeInput = document.createElement('input');
    completeInput.type = 'checkbox';
    completeInput.checked = todo.completed;
    completeInput.addEventListener('change', () => { checkCompleted(completeInput.checked, todo) })
    completeInput.classList.add('completeCheck')
    const textTodoDiv = document.createElement('div');
    textTodoDiv.textContent = todo.text;
    textTodoDiv.classList.add('textTodo');
    const todoLengthDiv = document.createElement('sup');
    todoLengthDiv.classList.add('todoLength');
    const additionalMenuButton = document.createElement('button');
    additionalMenuButton.classList.add('button', 'menuShow');
    additionalMenuButton.id = `additionalMenuButton${todo.idTodo}`
    additionalMenuButton.textContent = '...';
    const additionalMenuDiv = document.createElement('div');
    additionalMenuDiv.id = `additionalMenu${todo.idTodo}`;
    additionalMenuDiv.classList.add('additionalMenu', 'hide');
    const nextTodoButton = document.createElement('button');
    nextTodoButton.classList.add('button', 'nextTodo', 'hide', 'show');
    nextTodoButton.textContent = '🔻';
    nextTodoButton.id = `nextTodoButton${todo.idTodo}`;
    const nextTodoDiv = document.createElement('div');
    nextTodoDiv.id = `secondaryTodo${todo.idTodo}`;
    nextTodoDiv.classList.add('secondaryTodo');
    additionalMenuButton.addEventListener('click', () => {show(additionalMenuButton.id, additionalMenuDiv.id)})
    nextTodoButton.addEventListener('click', () => {show(nextTodoButton.id, nextTodoDiv.id, todo)});
    const breakDiv = document.createElement('div');
    breakDiv.classList.add('break');

    todoLi.appendChild(completeInput);
    todoLi.appendChild(textTodoDiv);
    todoLi.appendChild(todoLengthDiv);
    todoLi.appendChild(additionalMenuDiv);
    todoLi.appendChild(additionalMenuButton);
    todoLi.appendChild(nextTodoButton);
    todoLi.appendChild(breakDiv);
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

      nextTodoButton.classList.remove('hide');
      const arrMap = todo.todo.map(value => value.completed);
      const arrComplete = arrMap.filter(value => value === true);
      todoLengthDiv.textContent = `${arrComplete.length}\\${arrMap.length}`;
      if(!todo.show) {
        nextTodoDiv.classList.add('hide');
        nextTodoButton.classList.remove('show');
      }

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
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('main');
  const baseDiv = document.createElement('div')
  baseDiv.classList.add('base');
  baseDiv.id = 'base'
  document.body.appendChild(mainDiv);
  const todoList = document.createElement('div')
  todoList.classList.add('todoList');
  todoList.id = 'todoList';

  const menuButton = document.createElement('button');
  menuButton.classList.add('button', 'menu', 'slide');
  menuButton.id = 'menuButton';
  menuButton.textContent = '⇶'
  menuButton.addEventListener('click', showPanel)
  mainDiv.appendChild(baseDiv);
  baseDiv.appendChild(menuButton);
  baseDiv.appendChild(todoList)
}

load();

export { detailRenderTodo, renderPanelControl, renderGroupContent }