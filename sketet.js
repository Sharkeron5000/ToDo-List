// Пример задач.
const todo0 = [{
  textTodo: 'Список 1',
  completedTodo: false,
  tags: ['список задач', 'задания'],
  show: false,
  todo: [{
    textTodo: 'Список 113',
    completedTodo: true,
    tags: ['список задач', 'задания'],
    show: false,
    todo: [],
    idGroup: 0,
    idTodo: 2
  },
  {
    textTodo: 'Список 133',
    completedTodo: false,
    tags: ['список задач', 'задания'],
    show: false,
    todo: [],
    idGroup: 0,
    idTodo: 3
  }],
  idGroup: 0,
  idTodo: 0
},
{
  textTodo: 'Список 2',
  completedTodo: false,
  tags: ['список задач', 'задания'],
  show: false,
  todo: [],
  idGroup: 0,
  idTodo: 1
},]

const todo1 = [{
  textTodo: 'Список 3',
  completedTodo: false,
  tags: ['список задач', 'задания'],
  show: false,
  todo: [],
  idGroup: 1,
  idTodo: 0
},
{
  textTodo: 'Список 4',
  completedTodo: true,
  tags: ['список задач', 'задания'],
  show: false,
  todo: [],
  idGroup: 1,
  idTodo: 1
},]

const group = [{
  textGroup: 'Задачи для тестов',
  completedGroup: false,
  tags: ['Тег задачи для тестов', 'Тесты'],
  id: 0
},
{
  textGroup: 'Задачи для тестов 2',
  completedGroup: false,
  tags: ['Теги', 'Проверка'],
  id: 1
},
{
  textGroup: 'Задачи для тестов 3',
  completedGroup: true,
  tags: ['Теги', 'Проверка'],
  id: 2
},
]
export function getStart() {
  localStorage.setItem('todo0', JSON.stringify(todo0));
  localStorage.setItem('todo1', JSON.stringify(todo1));
  localStorage.setItem('todoGroup', JSON.stringify(group));
}