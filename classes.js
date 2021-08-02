import { save } from "./functions.js";

/** Группа задач, выводщаяся в главном меню */
class Group {
  /** Название группы */
  text;
  /** Теги */
  tags;
  /**Идентификатор группы */
  static #id = 0;
  /**Завершена задача или нет */
  completed

  constructor(text, tags, completed, idTodo = null) {
    this.text = text || prompt('Введите название группы') || 'Без названия';
    // this.tags = tags || prompt('Введите теги, через запятую', '').split(',') || [];
    this.tags = [];
    this.completed = completed || false;
    this.idGroup = 'Group'
    if(idTodo === null) {
      this.idTodo = Group.#id
    } else {
      this.idTodo = idTodo
    }
    Group.#id++
  }
}

/**Класс хранящий структуру с задачами и свойствами */
class Todo {
  /** Название задачи */
  text;
  /** Статус выполнения */
  completed;
  /** Теги у задачи */
  tags;
  /** Список подзадачи */
  todo;
  /** Номер принадлежащей группе */
  idGroup;
  /**Индекс элемента в массиве */
  index;
  /**Родительский массив */
  parent;
  /**Индекс родительского массива */
  parentIndex;
  /**Показывать подзадачи */
  show
  /** Номер задачи */
  static #id = 0;

  constructor(idGroup, parent = [], index, todo = [], text, tags, completed = false, show = true, id = null) {
    this.text = text || prompt('Название задачи', 'Тест') || 'Без названия';
    this.completed = completed;
    // this.tags = tags || prompt('Введите теги, через запятую', '').split(',') || [];
    this.tags = [];
    this.todo = todo;
    this.idGroup = idGroup;
    this.index = index;
    this.parent = parent;
    this.show = show;
    if(parent.length !==0) this.parentIndex = parent.index
    if(id === null) {
      this.idTodo = Todo.#id
    } else {
      this.idTodo = id
    }
    Todo.#id++;
  }
}

class cacheElement {
  constructor() {
    this.inputCheck = document.createElement('input');
    this.inputCheck.type = 'checkbox';

    this.textTodoElem = this.text
  }
}

export {Group, Todo}