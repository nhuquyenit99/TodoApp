const storageKey = "all-list";
var todoList = [];
var listString = "";

var footerActions = document.getElementById("footer-actions");
var countTasks = document.getElementById("count-tasks");
var listData = document.getElementById("list-data");
var todoInput = document.getElementById("todo-input");
var btnToggleAll = document.getElementById("toggle-all");

var filters = document.getElementsByClassName("filters")[0];
var btnClearCompleted = document.getElementsByClassName("clear-completed");

var labelToggleAll = document.getElementById('label-toggle-all');
const enterKey = 13;

function saveData(todoList) {
  listString = JSON.stringify(todoList);
  localStorage.setItem(storageKey, listString);
}

function convertToHTML(list) {
  const content = list.map(function (item) {
    return `
      <li id=${item.id} class=${item.done ? "completed" : ""}>
        <div class="todo-wrapper">
          <input class="toggle" type="checkbox" ${item.done ? "checked" : ""}>
          <label>${item.content}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${item.content}">
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
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].done === true) check = true;
  }
  if (check) {
    if (btnClearCompleted.length === 0) {
      let button = document.createElement("button");
      let text = document.createTextNode("Clear completed");

      button.className = "clear-completed";
      button.appendChild(text);
      footerActions.appendChild(button);

      button.addEventListener("click", () => {
        todoList = todoList.filter((item) => {
          return item.done === false;
        });
        saveData(todoList);
        renderFilteredData();
        console.log(button);
        if(button){
          footerActions.removeChild(button);
        }
      });
    }
  } else {
    console.log(btnClearCompleted[0]);
    footerActions.removeChild(btnClearCompleted[0]);
  }
}

function showCountTasks() {
  const todoTasks = todoList.filter((item) => item.done === false);
  countTasks.innerHTML = "<strong>" + todoTasks.length + "</strong> items left";
}
function modifyBtnToggleAll() {
  if(todoList.length === 0) {
    labelToggleAll.style.display = "none";
    console.log(btnToggleAll.checked);
    if (btnToggleAll.checked){
      btnToggleAll.checked = false;
    }
  }
  let isAllCompleted = true;
  for(let i = 0; i < todoList.length; i++) {
    if (todoList[i].done === false) isAllCompleted = false;
  }
  if (isAllCompleted === true){
    btnToggleAll.checked = true;
  } else {
    btnToggleAll.checked = false;
  }
}
function render() {
  listString = localStorage.getItem(storageKey);
  if (listString) {
    todoList = JSON.parse(listString);
    const content = convertToHTML(todoList);
    listData.innerHTML = content.join("");
  }
  showFooter();
  modifyBtnToggleAll();
}
// add new task
todoInput.onkeypress = (e) => {
  if (e.charCode === enterKey && todoInput.value.trim() !== "") {
    let newTask = {};
    newTask.id = new Date().valueOf();
    newTask.content = todoInput.value;
    newTask.done = false;
    todoList.push(newTask);

    todoInput.value = "";

    saveData(todoList);
    labelToggleAll.style.display = "block";
    btnToggleAll.checked = false;
  }
  renderFilteredData();
};

function deleteTask(taskId) {
  let index;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == taskId) {
      index = i;
    }
  }
  todoList.splice(index, 1);
  saveData(todoList);
  renderFilteredData();
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
  renderFilteredData();
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
  let completedTasksCounter = todoList.reduce((count, item) => {
    if (item.done === true) count++;
    return count;
  }, 0);
  if (completedTasksCounter === todoList.length) {
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
  renderFilteredData();
});

function renderFilteredData() {
  const selectedFilter = document.getElementsByClassName("selected")[0];
  const redirect = selectedFilter.getAttribute("href");
  let list = [];
  switch (redirect) {
    case "#/all":
      list = todoList;
      break;
    case "#/active":
      list = todoList.filter((item) => item.done === false);
      break;
    case "#/completed":
      list = todoList.filter((item) => item.done === true);
      break;
  }
  const content = convertToHTML(list);
  listData.innerHTML = content.join("");
  showFooter();
  modifyBtnToggleAll();
}

filters.addEventListener("click", (event) => {
  const element = event.target;
  if (element.tagName === "A") {
    const filterSelected = document.getElementsByClassName("selected")[0];
    filterSelected.removeAttribute("class");
    element.className = "selected";
    renderFilteredData();
  }
});

listData.addEventListener("dblclick", (event) => {
  const element = event.target;
  if (element.tagName === "LABEL") {
    const taskElement = element.parentNode.parentNode;
    taskElement.classList.add("editing");
    const inputEdit = taskElement.lastElementChild;

    inputEdit.selectionStart = inputEdit.value.length;
    inputEdit.selectionEnd = inputEdit.value.length;
    console.log(inputEdit.value.length);
    inputEdit.focus();

    const taskId = taskElement.getAttribute("id");

    inputEdit.onblur = () => {
      todoList.forEach((item) => {
        if (item.id == taskId) {
          item.content = inputEdit.value;
        }
        return item;
      });

      saveData(todoList);
      taskElement.classList.remove("editing");
      renderFilteredData();
    }
    
    inputEdit.onkeypress = (e) => {
      if (e.charCode === enterKey && inputEdit.value.trim() !== "") {
        todoList.forEach((item) => {
          if (item.id == taskId) {
            item.content = inputEdit.value;
          }
          return item;
        });

        saveData(todoList);
        taskElement.classList.remove("editing");
        renderFilteredData();
      }
    };
  }
});

function editTask (taskId){
  todoList.forEach((item) => {
    if (item.id == taskId) {
      item.content = inputEdit.value;
    }
    return item;
  });

  saveData(todoList);
  taskElement.classList.remove("editing");
  renderFilteredData();
}
render();
