var storageKeyAll = 'allList';
var storageKeyTodo = 'todoList';
var storageKeyDone = 'doneList';

var todoList = [];
var allList = [];
var doneList = [];

var listString = '';
var todoString = '';
var doneString = '';

var total = 0;

function render(){
  var htmlList = document.getElementById('list-data');
  listString = localStorage.getItem(storageKeyAll);
  if (listString){
    allList = JSON.parse(listString);
    count = allList.length;
    var content = allList.map(function(item){
      return  `<li>
      <div class="view">
      <input class="toggle" type="checkbox" ${item.done?'checked':''}>
      <label>${item.content}</label>
      <button class="destroy"></button>
      </div>
      <input class="edit" value="${item.content}">
      </li>`;
    });
    htmlList.innerHTML = content.join('');

    var footerActions = document.getElementById('footer-actions');
    footerActions.style.display = "block";

    var countTasks = document.getElementById('count-tasks');
    todoString = localStorage.getItem(storageKeyTodo);
    todoList = JSON.parse(todoString);
    countTasks.innerHTML = '<strong>'+ todoList.length +'</strong> items left';
  }
}

function Task(content){
  this.content = content;
  this.done = false;
  this.id = ++total;
}

function addTask(e){
  todoInput = document.getElementById('todo-input');
  if(e.charCode === 13 && todoInput.value!==''){
    let newTask = new Task(todoInput.value);
    todoList.push(newTask);
    allList.push(newTask);

    todoInput.value ='';

    ListString = JSON.stringify(allList);
    localStorage.setItem(storageKeyAll,ListString);
    todoString = JSON.stringify(todoList);
    localStorage.setItem(storageKeyTodo,todoString);
  }

  render();
}
render();
