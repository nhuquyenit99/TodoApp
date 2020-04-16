var storageKey = 'todoList';
var todoList = [];
var listString = '';
function render(){
  var htmlList = document.getElementById('list-data');
  listString = localStorage.getItem(storageKey);
  todoList = JSON.parse(listString);
  var content = todoList.map(function(item){
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
  if (todoList.length!==0){
    var footerActions = document.getElementById('footer-actions');
    footerActions.style.display = "block";
  }
  var countTasks = document.getElementById('count-tasks');
  countTasks.innerHTML = '<strong>'+ todoList.length +'</strong> items left'
}
function Assignment(content){
    this.content = content;
    this.done = false;
    this.id = ++total;
}
function addAssignment(e){
  todoInput = document.getElementById('todo-input');
  if(e.charCode === 13 && todoInput.value!==''){
    let newAssignment = new Assignment(todoInput.value);
    todoList.push(newAssignment);
    todoInput.value ='';
    listString = JSON.stringify(todoList);
    localStorage.setItem(storageKey,listString);
  }

  render();
}
render();
