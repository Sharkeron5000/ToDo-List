// Дополнительные функцию увеличивающие функционал приложения, но не отвечающие за прорисовку DOM элементов
import { Group, Todo } from './classes.js';
import { detailRenderTodo, renderPanelControl, renderGroupContent } from './index.js';

/**Получить номер задачи и передать ее на отображение */
export function render() {
  const findId = +this.getAttribute('todo');
  const baseDiv = document.getElementById('base');
  const panelControl = document.getElementById('basePanel');
  const todo = localStorage.getItem(`todo${findId}`);

  showPanel();
  renderGroupContent();
  renderTodo(findId);
}

/** Вывести список задач на экран */
export function renderTodo(numIdGroup, todoListNow) {
  const todoStorage = JSON.parse(localStorage.getItem(`todo${numIdGroup}`));
  const now = (todoStorage.length === 0) ? 0 : todoStorage;
  localStorage.setItem('todoNow', JSON.stringify(now));
  const baseDiv = document.getElementById('base');
  const todoListDiv = document.getElementById('todoList');
  const noTodo = document.getElementById('noTodo');
  const panel = document.getElementById('basePanel');

  if (panel) baseDiv.removeChild(panel);
  if (noTodo) baseDiv.removeChild(noTodo);

  if (!todoStorage || todoStorage.length === 0) {
    todoListDiv.innerHTML = null;

    const noTodoNext = document.getElementById('todoList');
    noTodoNext.textContent = 'Задач не найдено';
    renderPanelControl(baseDiv, 'basePanel', numIdGroup);
    return null;
  }

  detailRenderTodo(todoStorage, numIdGroup, todoListDiv, todoStorage)
  renderPanelControl(baseDiv, 'basePanel', numIdGroup);
}

/**Показать/скрыть боковое меню */
export function showPanel() {
  const button = document.getElementById('menuButton');
  const menu = document.getElementById('menu');
  const panelControl = document.getElementById('basePanel');
  const todo = document.getElementById('todoList');
  const noTodo = document.getElementById('noTodo');

  button.classList.toggle('slide');
  menu.classList.toggle('slide');
  todo.classList.toggle('hide');
  if (panelControl) panelControl.classList.toggle('hide');
  if (noTodo) noTodo.classList.toggle('hide');
}

/** Сохранить новые данные в localstorage */
export function save(idGroup, todo) {
  const now = (todo.length === 0) ? 0 : todo;

  localStorage.setItem(`todo${idGroup}`, JSON.stringify(todo));
  if (idGroup !== "Group") {
    renderTodo(idGroup);
  }
  renderGroupContent();
}

/** Заполнение количество выполненных задач и их количество */
// export function todoLength(divElement, todo) {
//   const arrMap = todo.todo.map(value => value.completedTodo);
//   const arrComplete = arrMap.filter(value => value === true);
//   divElement.textContent = `${arrComplete.length}\\${arrMap.length}`;
// }

/** Проверка и изменение выполненой задачи  */
export function checkCompleted(check, todo, parentTodo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));
  eachArr('check', todoArr, todo, parentTodo, check);
  // ДОДЕЛАТЬ ЗАВЕРШЕНИЕ ДОЧЕРНИХ ПОДЗАДАЧ
  save(todo.idGroup, todoArr)
}

/**изменение основной задачи, при завершении всех подзадач */
export function checkChange(boolean, todo, parentTodo) {

}

/** Удалить подзадачи в основных заданиях */
function clear(todo, conf) {
  todo.splice(0, todo.length, ...todo.filter(elem => !elem.completedTodo));
  if (conf) {
    todo.filter(elem => {
      if (elem.todo.length !== 0) clear(elem.todo)
    })
  }
}

/**Перебор масива 
 * @event наименование тригера
 * @todoArr Массив который надо перебрать
 * @todoEvent - элемент, по которому надо искать
 * @todo Список задач или переменная, с которым надо работать
 * @name дополнительная переменная. Задает имя изменяемой переменной 
*/
function eachArr(event, todoArr, todoEvent, todo = null, name = null) {
  todoArr.forEach(elem => {
    console.log('TodoArr', todoArr);
    console.log('TodoEvent', todoEvent);
    console.log('Todo', todo);
    if (event === 'push' && elem.idTodo === todoEvent.idTodo) elem.todo.push(todo);
    if (event === 'delete' && elem.idTodo === todoEvent.idTodo) elem.todo.splice(elem.todo.findIndex(elem => elem.idTodo === todo.idTodo), 1);
    if (event === 'change' && elem.idTodo === todoEvent.idTodo) elem[name] = todo;
    if (event === 'check' && elem.idTodo === todoEvent.idTodo) {
      elem.completedTodo = todo;
      

      if (!Array.isArray(todo)) todo.completedTodo = todo.todo.every(todoWith => todoWith.completedTodo === true)
    }
    if (elem.todo.length !== 0) eachArr(event, elem.todo, todoEvent, todo, name);
  })
}

// Далее идут тригеры для кнопок в DOM
/**Добавление новых задач в группу или основной список*/
function addGroup(idElement, idGroup) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${idGroup}`));
  let todo;
  if (idElement === 'groupPanel') {
    todo = new Group();
  }
  if (idElement === 'basePanel') {
    todo = new Todo(idGroup);
  }
  todoArr.push(todo);
  save(idGroup, todoArr);
}

/** Удаление выполеннных задач из группы или основного списка*/
function deleteGroup(idElement, idGroup) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${idGroup}`))
  console.log(todoArr);
  if (idElement === 'groupPanel') {
    const conf = confirm('Вы точно хотите удалить все завершенные группы задач?');
    if (!conf) return alert("Вы отменили удаление");
    todoArr.splice(0, todoArr.length, ...todoArr.filter(elem => !elem.completedGroup));
  }
  if (idElement === 'basePanel') {
    const conf = confirm('Вы точно хотите удалить выполненные основные задания?');
    if (!conf) return alert('Вы отменили удаление');
    const confToo = confirm('Вы хотите удалить ещё выполненые подзадачи?');
    clear(todoArr, confToo);
  }
  save(idGroup, todoArr);
}

/** Удаление всех задач в группе или основного списка */
function clearAllGroup(idElement, idGroup) {
  if (idElement === 'groupPanel') {
    localStorage.clear();
  }
  save(idGroup, []);
}

/** Добавление новых подзадач */
function addWithTodo(todoParent, todo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todoParent.idGroup}`));
  const todo = new Todo(todoParent.idGroup);

  eachArr('push', todoArr, todoParent, todo);
  save(todoParent.idGroup, todoArr)
}

/** Изменить любую выбранную задачу */
function changeTodo(name, todo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));
  if (name === 'textTodo') {
    let newTodoText = prompt('Введите новое название задачи', 'Тест') || '';
    eachArr('change', todoArr, todo, newTodoText, name)
  }
  if (name === 'tags') {
    const newTags = prompt('Введите новые теги через запятую', 'Тест').split(',') || [];
    eachArr('change', todoArr, todo, newTags, name)
  }

  save(todo.idGroup, todoArr)
}

/** Удалить любую выбранную задачу */
function deleteTodo(todo, parentTodo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));

  if (Array.isArray(parentTodo) && parentTodo[0].idGroup === todoArr[0].idGroup) {
    todoArr.splice(todoArr.findIndex(elem => elem.idTodo === todo.idTodo), 1)
    return save(todo.idGroup, todoArr);
  }
  eachArr('delete', todoArr, parentTodo, todo)

  save(todo.idGroup, todoArr);
}

export const trigger = {
  addGroup, deleteGroup, clearAllGroup, addWithTodo, changeTodo, deleteTodo
}