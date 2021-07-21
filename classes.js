import { save } from "./functions.js";

/** Группа задач, выводщаяся в главном меню */
class Group {
  /** Название группы */
  textGroup;
  /** Теги */
  tags;
  /**Идентификатор группы */
  static #id = 0;
  /**Завершена задача или нет */
  completedGroup

  constructor(text, tags, completed, id = null) {
    this.textGroup = text || prompt('Введите название группы') || '';
    // this.tags = tags || prompt('Введите теги, через запятую', '').split(',') || [];
    this.tags = [];
    this.completedGroup = completed || false;
    if(id === null) {
      this.id = Group.#id
    } else {
      this.id = id
    }
    Group.#id++
  }
}

/**Класс хранящий структуру с задачами и свойствами */
class Todo {
  /** Название задачи */
  textTodo;
  /** Статус выполнения */
  completedTodo;
  /** Теги у задачи */
  tags;
  /** Список подзадачи */
  todo;
  /** Номер принадлежащей группе */
  idGroup;
  /**Родительский массив */
  parent;
  /**Индекс элемента в родитеском массиве */
  index;
  /** Номер задачи */
  static #id = 0;

  constructor(idGroup, parent, index, todo = [], text, tags, completed = false, id = null) {
    this.textTodo = text || prompt('Название задачи', 'Тест') || '';
    this.completedTodo = completed;
    // this.tags = tags || prompt('Введите теги, через запятую', '').split(',') || [];
    this.tags = [];
    this.todo = todo;
    this.idGroup = idGroup;
    this.parent = parent;
    this.index = index
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