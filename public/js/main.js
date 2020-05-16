var storageKey = "all-list";

var todoList = [];

var listString = "";

function convertToHTML(list) {
  var content = todoList.map(function (item) {
    return `
      <li id = ${item.id} class = ${item.done ? "completed" : ""}>
        <div class = "todo-wrapper">
          <input class = "toggle" type = "checkbox" ${
            item.done ? "checked" : ""
          }>
          <label>${item.content}</label>
          <button class = "destroy"></button>
        </div>
        <input class = "edit" value = "${item.content}">
      </li>`;
  });
  return content;
}
function showFooter() {
  var element = document.getElementById("footer-actions");
  if (todoList.length !== 0) {
    element.style.display = "block";
    showCountTasks();
  } else element.style.display = "none";
}
function showCountTasks() {
  var countTasks = document.getElementById("count-tasks");
  var todoTasks = todoList.filter((item) => item.done === false);
  countTasks.innerHTML = "<strong>" + todoTasks.length + "</strong> items left";
}
function render() {
  var htmlList = document.getElementById("list-data");
  listString = localStorage.getItem(storageKey);
  if (listString) {
    todoList = JSON.parse(listString);
    var content = convertToHTML(todoList);
    htmlList.innerHTML = content.join("");
  }
  showFooter();
}

// add new task
var todoInput = document.getElementById("todo-input");
todoInput.onkeypress = function (e) {
  const enterKey = 13;
  todoInput = document.getElementById("todo-input");
  if (e.charCode === enterKey && todoInput.value.trim() !== "") {
    let newTask = {};
    newTask.id = new Date().valueOf();
    newTask.content = todoInput.value;
    newTask.done = false;
    todoList.push(newTask);

    todoInput.value = "";

    listString = JSON.stringify(todoList);
    localStorage.setItem(storageKey, listString);
  }
  render();
};

function deleteTask(taskId) {
  var index;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == taskId) {
      index = i;
    }
  }
  todoList.splice(index, 1);
  listString = JSON.stringify(todoList);
  localStorage.setItem(storageKey, listString);
  render();
}

function completeTask(taskId) {
  todoList.map((item) => {
    if (item.id == taskId) {
      item.done = !item.done;
      return item;
    }
    return item;
  });
  listString = JSON.stringify(todoList);
  localStorage.setItem(storageKey, listString);

  render();
}

var listData = document.getElementById("list-data");
listData.addEventListener("click", (event) => {
  var element = event.target;
  var value = element.getAttribute("class");
  switch (value) {
    case "destroy":
      deleteTask(element.parentNode.parentNode.id);
      break;
    case "toggle":
      completeTask(element.parentNode.parentNode.id);
      break;
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

