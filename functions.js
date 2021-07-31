// Дополнительные функцию увеличивающие функционал приложения, но не отвечающие за прорисовку DOM элементов
import { Group, Todo } from './classes.js';
import { detailRenderTodo, renderPanelControl, renderGroupContent } from './index.js';

export function firstLaunch() {
  localStorage.setItem('todoGroup', '[]');
}

/**Получить номер задачи и передать ее на отображение */
export function render() {
  const findId = +this.getAttribute('todo');
  const todo = JSON.parse(localStorage.getItem(`todo${findId}`));
  localStorage.setItem('todoNow', JSON.stringify(todo))

  showPanel();
  renderGroupContent();
  renderTodo(findId, todo);
}

/** Вывести список задач на экран */
export function renderTodo(numIdGroup, todoListNow) {
  const baseDiv = document.getElementById('base');
  const todoListDiv = document.getElementById('todoList');
  const noTodo = document.getElementById('noTodo');
  const panel = document.getElementById('basePanel');

  if (panel) baseDiv.removeChild(panel);
  if (noTodo) baseDiv.removeChild(noTodo);

  if (!todoListNow || todoListNow.length === 0) {
    todoListDiv.innerHTML = null;

    const noTodoNext = document.getElementById('todoList');
    noTodoNext.textContent = 'Задач не найдено';
    renderPanelControl(baseDiv, 'basePanel', numIdGroup);
    return null;
  }

  detailRenderTodo(todoListNow, numIdGroup, todoListDiv)
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
    renderTodo(idGroup, now);
    localStorage.setItem(`todoNow`, JSON.stringify(now));
  }
  renderGroupContent();
}

/** Проверка и изменение выполненой задачи  */
export function checkCompleted(check, todo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));
  eachArr('check', todoArr, todo, check);
  // checkChangeTodo(todo)
  save(todo.idGroup, todoArr)
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

/**Изменение показа/непоказа дополнительного меню и подзадач */
export function show(idEvent, idTarget, todo = null) {
  document.getElementById(idEvent).classList.toggle('show');
  document.getElementById(idTarget).classList.toggle('hide');

  const storage = JSON.parse(localStorage.getItem('todoNow'));
  if (idTarget.includes('secondaryTodo')) {
    eachArr('show', storage, todo);
    save(todo.idGroup, storage);  
  }

}

/**Перебор масива 
 * @event наименование тригера
 * @todoArr Массив который надо перебрать
 * @todoEvent - элемент, по которому надо искать
 * @todo Список задач или переменная, с которым надо работать
 * @name дополнительная переменная. Задает имя изменяемой переменной 
*/
export function eachArr(event, todoArr, todoEvent, todo = null, name = null) {
  todoArr.forEach(elem => {
    if (event === 'push' && elem.idTodo === todoEvent.idTodo) elem.todo.push(todo);
    if (event === 'delete' && elem.idTodo === todoEvent.idTodo) elem.todo.splice(elem.todo.findIndex(elem => elem.idTodo === todo.idTodo), 1);
    if (event === 'change' && elem.idTodo === todoEvent.idTodo) elem[name] = todo;
    if (event === 'show' && elem.idTodo === todoEvent.idTodo) elem.show = !elem.show;
    if (event === 'completed') elem.completedTodo = todo;
    if (event === 'check' && elem.idTodo === todoEvent.idTodo) {
      elem.completedTodo = todo;
      if (elem.todo.length !== 0) eachArr('completed', elem.todo, todoEvent, todo)
    }
    if (elem.todo && elem.todo.length !== 0) eachArr(event, elem.todo, todoEvent, todo, name);
  })
}

// Далее идут ТРИГЕРЫ для кнопок в DOM
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
  const check = JSON.parse(localStorage.getItem(`todo${idGroup}`));
  if (check.length === 0) return alert('Здесь нечего удалять');

  const conf = confirm('Вы точно хотите удалить все группы и все связанные с ними задачи?');
  if (!conf) return alert('Вы отменили удаление')
  if (idElement === 'groupPanel') {
    localStorage.clear();
  }
  save(idGroup, []);
}

/** Добавление новых подзадач */
function addWithTodo(todoParent, todo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todoParent.idGroup}`));
  const todoGroup = new Todo(todoParent.idGroup);

  eachArr('push', todoArr, todoParent, todoGroup);
  save(todoParent.idGroup, todoArr)
}

/** Изменить любую выбранную задачу */
function changeTodo(name, todo) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));
  if (name === 'text') {
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
function deleteTodo(todo, parentTodo = null) {
  const todoArr = JSON.parse(localStorage.getItem(`todo${todo.idGroup}`));
  if (todo.idGroup === 'Group') {
    todoArr.splice(0, todoArr.length, ...todoArr.filter(elem => elem.idTodo !== todo.idTodo));
  } else {
    if (Array.isArray(parentTodo) && parentTodo[0].idGroup === todoArr[0].idGroup) {
      todoArr.splice(todoArr.findIndex(elem => elem.idTodo === todo.idTodo), 1)
      return save(todo.idGroup, todoArr);
    }
    eachArr('delete', todoArr, parentTodo, todo)
  }

  save(todo.idGroup, todoArr);
}

export const trigger = {
  addGroup, deleteGroup, clearAllGroup, addWithTodo, changeTodo, deleteTodo
}