var storageKey = 'allList';

var todoList = [];
var allList = [];
var doneList = [];

var listString = '';

function convertToHTML(list){
  var content = allList.map(function(item){
    return  `
      <li id= ${item.id} class=${item.done?'completed':''}>
        <div class="view">
          <input class="toggle" type="checkbox" ${item.done?'checked':''}>
          <label>${item.content}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${item.content}">
      </li>`;
  });
  return content;
}
function showFooter(){
  var element = document.getElementById('footer-actions');
  if (allList.length!==0){
    element.style.display = 'block';
    showCountTasks();   
  } 
  else element.style.display = 'none';
}
function showCountTasks(){
  var countTasks = document.getElementById('count-tasks');
    todoList = allList.filter(item => item.done===false)
    countTasks.innerHTML = '<strong>'+ todoList.length +'</strong> items left';
}
function render(){
  var htmlList = document.getElementById('list-data');
  listString = localStorage.getItem(storageKey);
  if (listString){
    allList = JSON.parse(listString);
    var content = convertToHTML(allList);
    htmlList.innerHTML = content.join('');
  }
  showFooter();
}

// add new task
var todoInput = document.getElementById('todo-input')
todoInput.onkeypress = function (e){
  const enterKey = 13;
  todoInput = document.getElementById('todo-input');
  if(e.charCode === enterKey && todoInput.value.trim()!==''){
    let newTask = {};
    newTask.id = new Date().valueOf();
    newTask.content = todoInput.value;
    newTask.done = false;
    allList.push(newTask);

    todoInput.value ='';

    ListString = JSON.stringify(allList);
    localStorage.setItem(storageKey,ListString);
  }
  render();
}

function deleteTask(taskId){
  var index;
  for(let i=0;i<allList.length;i++){
    if(allList[i].id === taskId) {
      index = i;
    } 
  }
  allList.splice(index,1);
  listString = JSON.stringify(allList);
  localStorage.setItem(storageKey,listString);
  render();
}

function completeTask(taskId){
  allList.map(item=>{
    if(item.id == taskId){
      item.done = !item.done;
      return item;
    }
    return item;
  })
  listString = JSON.stringify(allList);
  localStorage.setItem(storageKey,listString);

  render();
}

var todoList = document.getElementById("list-data");
todoList.addEventListener("click",event=>{
  var element = event.target;
  var value = element.getAttribute("class");
  switch (value){
    case "destroy":
      deleteTask(element.parentNode.parentNode.id);
      break;
    case "toggle": 
      completeTask(element.parentNode.parentNode.id);
      break;
  }
});
render();