var storageKey = "all-list";
var todoList = [];
var listString = "";

var footerActions = document.getElementById("footer-actions");
var countTasks = document.getElementById("count-tasks");
var listData = document.getElementById("list-data");
var todoInput = document.getElementById("todo-input");
var btnToggleAll = document.getElementById("toggle-all");

var filters = document.getElementsByClassName("filters")[0];
var btnClearCompleted = document.getElementsByClassName("clear-completed");

function saveData(todoList){
  listString = JSON.stringify(todoList);
  localStorage.setItem(storageKey, listString);
}

function convertToHTML(list) {
  var content = list.map(function (item) {
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
  if (todoList.length !== 0) {
    footerActions.style.display = "block";
    showCountTasks();
    modifyBtnClearCompleted();
  } else footerActions.style.display = "none";
}

function modifyBtnClearCompleted() {
  let check = false;
  for(let i = 0; i < todoList.length; i ++) {
    if (todoList[i].done === true) check = true;
  }
  if (check) {
    if(btnClearCompleted.length === 0){
      let button = document.createElement("button");
      let text = document.createTextNode("Clear completed"); 
    
      button.className = "clear-completed";
      button.appendChild(text);
      footerActions.appendChild(button);

      button.addEventListener("click", () => {
        todoList = todoList.filter(item => {
          return item.done === false;
        })
        saveData(todoList);
        renderData();
        footerActions.removeChild(button);
      });
    }
  }
  else {
    footerActions.removeChild(btnClearCompleted[0]);
  }
}

function showCountTasks() {
  var todoTasks = todoList.filter((item) => item.done === false);
  countTasks.innerHTML = "<strong>" + todoTasks.length + "</strong> items left";
}

function render() {
  listString = localStorage.getItem(storageKey);
  if (listString) {
    todoList = JSON.parse(listString);
    const content = convertToHTML(todoList);
    listData.innerHTML = content.join("");
  }
  showFooter();
}

// add new task
todoInput.onkeypress = function (e) {
  const enterKey = 13;
  if (e.charCode === enterKey && todoInput.value.trim() !== "") {
    let newTask = {};
    newTask.id = new Date().valueOf();
    newTask.content = todoInput.value;
    newTask.done = false;
    todoList.push(newTask);

    todoInput.value = "";

    saveData(todoList);
  }
  renderData();
};

function deleteTask(taskId) {
  var index;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == taskId) {
      index = i;
    }
  }
  todoList.splice(index, 1);
  saveData(todoList);
  renderData();
}

function completeTask(taskId) {
  todoList.forEach((item) => {
    if (item.id == taskId) {
      item.done = !item.done;
      return item;
    }
    return item;
  });

  saveData(todoList);
  renderData();
}

listData.addEventListener("click", (event) => {
  const element = event.target;
  const elementClass = element.getAttribute("class");
  switch (elementClass) {
    case "destroy":
      deleteTask(element.parentNode.parentNode.id);
      break;
    case "toggle":
      completeTask(element.parentNode.parentNode.id);
      break;
  }
});

btnToggleAll.addEventListener("click", () => {
  let count = todoList.reduce((count, item) => {
    if (item.done === true) count++;
    return count;
  }, 0);
  if (count === todoList.length) {
    todoList.forEach((item) => {
      item.done = false;
      return item;
    });
  } else {
    todoList.forEach((item) => {
      item.done = true;
      return item;
    });
  }
  saveData(todoList);
  renderData();
});

function renderData() {
  const selectedFilter = document.getElementsByClassName('selected')[0];
  const redirect = selectedFilter.getAttribute("href");
  let todoListComputed = [];
  switch (redirect){
    case "#/all":
      todoListComputed = todoList;
      break;
    case "#/active":
      todoListComputed = todoList.filter(item => item.done === false);
      break;
    case "#/completed":
      todoListComputed = todoList.filter(item => item.done === true);
      break;
  }
  const content = convertToHTML(todoListComputed);
  listData.innerHTML = content.join("");
  showFooter();
}

filters.addEventListener("click",(event) => {
  const element = event.target;
  let filterSelected = document.getElementsByClassName("selected")[0];
  filterSelected.removeAttribute("class");
  element.className = "selected";
  renderData();
});

render();


