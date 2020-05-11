var storageKey = 'allList';

var todoList = [];
var allList = [];
var doneList = [];

var listString = '';

function convertToHTML(list){
  var content = allList.map(function(item){
    return  `
      <li>
        <div class="view" id= ${item.id}>
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

function Task(content){
  this.id = new Date().valueOf();
  this.content = content;
  this.done = false;
}
// add new task
var todoInput = document.getElementById('todo-input')
todoInput.onkeypress = function (e){
  const enterKey = 13;
  todoInput = document.getElementById('todo-input');
  if(e.charCode === enterKey && todoInput.value.trim()!==''){
    let newTask = new Task(todoInput.value);
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
    if(allList[i].id === taskId) index = i; 
  }
  allList.splice(index,1);
  listString = JSON.stringify(allList);
  localStorage.setItem(storageKey,listString);
  render();
}

var todoList = document.getElementById("list-data");
todoList.addEventListener("click",event=>{
  var element = event.target;
  if (element.getAttribute("class")== "destroy"){
    deleteTask(element.parentNode.id);
  }
});

var btnToggleAll = document.getElementById("toggle-all");
btnToggleAll.addEventListener("click",()=>{
  let count = allList.reduce((count,item)=>{
    if(item.done === true) count++;
    return count;
  },0);
  if (count===allList.length){
    allList.map(item=>{
      item.done= false;
      return item;
    })
  }
  else{
    allList.map(item=>{
      item.done= true;
      return item;
    })
  } 
  listString = JSON.stringify(allList);
  localStorage.setItem(storageKey,listString);

  render();
});

render();