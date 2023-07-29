// // const form = document.getElementById("todo-form");
// // const taskInput = document.getElementById("new-task-input");
// // const taskListEle = document.getElementById("task-list");

// // let todoArray = JSON.parse(localStorage.getItem("todos")) || [];
// // let editTodoId = -1;
// // console.log(todoArray.length);
// // //api call

// // todoArray.length === 0 &&
// //   fetch("https://jsonplaceholder.typicode.com/todos")
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error("Network response was not OK");
// //       }

// //       return response.json();
// //     })

// //     .then((data) => {
// //       // Process the received data
// //       data.forEach((dat) => {
// //         todoArray.push({
// //           value: dat.title,
// //           checked: false,
// //         });
// //       });
// //       console.log(todoArray.length);
// //       renderTodos();
// //     })

// //     .catch((error) => {
// //       // Handle any errors that occurred during the fetch request

// //       console.log("Error:", error.message);
// //     });

// // //1st render
// // renderTodos();
// // //Form submit
// // form.addEventListener("submit", function (e) {
// //   e.preventDefault(); //prevent refreshing the form

// //   addTask();
// //   renderTodos();
// //   localStorage.setItem("todos", JSON.stringify(todoArray));
// // });

// // //add task
// // function addTask() {
// //   const taskValue = taskInput.value;
// //   // check for duplicate value
// //   const isDuplicate = todoArray.some((todo) => {
// //     return todo.value.toUpperCase() === taskValue.toUpperCase();
// //   });

// //   // if task Value is empty
// //   if (taskValue === "") {
// //     alert("Please input a task value");
// //   } else if (isDuplicate) {
// //     alert("Task added is duplicate");
// //   } else {
// //     if (editTodoId >= 0) {
// //       //update the todo array
// //       todoArray = todoArray.map((todo, index) => {
// //         return {
// //           ...todo,
// //           value: index === editTodoId ? taskValue : todo.value,
// //         };
// //       });
// //       editTodoId = -1;
// //     } else {
// //       const todo = {
// //         value: taskValue,
// //         checked: false,
// //       };

// //       todoArray.push(todo);
// //     }

// //     taskInput.value = "";
// //   }
// // }

// // //Render todos
// // function renderTodos() {
// //   taskListEle.innerHTML = "";
// //   //   console.log(todoArray);
// //   todoArray.forEach((todo, index) => {
// //     // console.log(todo.value);
// //     taskListEle.innerHTML += `
// //           <div class="task" id=${index}>

// //           <i
// //            class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
// //            data-action="check"
// //           ></i>
// //             <input
// //               type="text"
// //               class="${todo.checked && "checked"} text"
// //               value="${todo.value}"
// //               readonly
// //              />

// //            <button class="edit" data-action="edit">edit</button>
// //            <button class="delete" data-action="delete">delete</button>

// //       </div>
// //     `;
// //   });
// // }

// //Click event listeners for all todos

// taskListEle.addEventListener("click", (event) => {
//   const target = event.target;
//   const parentElement = target.parentNode;
//   if (parentElement.className !== "task") return;

//   const todo = parentElement;
//   // get the task id
//   const todoId = Number(todo.id);

//   //target action custom attribute
//   const action = target.dataset.action;
//   action === "check" && checkedTodo(todoId);
//   action === "edit" && editTodo(todoId);
//   action === "delete" && deleteTodo(todoId);

//   //   console.log(todoId, action);
// });

// //check a todo
// function checkedTodo(todoId) {
//   todoArray = todoArray.map((todo, index) => {
//     return {
//       ...todo,
//       checked: index === todoId ? !todo.checked : todo.checked,
//     };
//   });
//   renderTodos();
// }
// // edit a todo
// function editTodo(todoId) {
//   taskInput.value = todoArray[todoId].value;
//   editTodoId = todoId;
// }

// //delete todo
// function deleteTodo(todoId) {
//   todoArray = todoArray.filter((todo, index) => index !== todoId);
//   editTodoId = -1;
//   renderTodos();
//   localStorage.setItem("todos", JSON.stringify(todoArray));
// }
const todoInput = document.getElementById("todo-input");

const todolistElement = document.getElementById("todos-list");
const prioritySelect = document.getElementById("priority-select");
const dateInput = document.getElementById("duedate");
const categoryFilter = document.getElementById("category-filter");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = -1;

// if(todos.length===0){
// fetch("https://jsonplaceholder.typicode.com/todos")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error('Network response was not OK');
//     }
//     return response.json();
//   })
//   .then((data) => {
//     // Process the received data

//     data.forEach((dat) => {
//       todos.push({
//         value: dat.title,
//         color: "#" + Math.floor(Math.random() * 16777215).toString(16),
//         checked: false,

//       });
//     });
//     // , console.log(data.length)
//     console.log(todos.length);
//     renderTodos();
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch request
//     console.log('Error:', error.message);
//   });
// }
//First render as we might have already exisiting todos in storage
renderTodos();

function addTodo() {
  const todoValue = todoInput.value;
  const dateValue = dateInput.value;
  const priorityValue = prioritySelect.value;
  //check if todo is empty
  const isEmpty = todoValue === "";

  //check for duplicate
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );

  if (isEmpty) {
    alert("Todo's input is empty");
  } else if (isDuplicate) {
    alert("entry already exists");
  } else {
    if (editId >= 0) {
      todos = todos.map((todo, index) => {
        return {
          value: index === editId ? todoValue : todo.value,
          color: todo.color,
          checked: todo.checked,
          date: dateValue,
          priority: index === editId ? priorityValue : todo.priority, // Update priority
          category: index === editId ? categoryFilter.value : todo.category,
        };
      });
      editId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        date: dateValue,
        priority: priorityValue,
        category: categoryFilter.value,
      });
    }
    todoInput.value = "";
    categoryFilter.value = "";
  }
  logActivity("Add", `Added task "${todoValue}"`);
}

//added eventlisteners to filters
document
  .getElementById("filter-priority-select")
  .addEventListener("change", applyFilters);
document
  .getElementById("filter-duedate")
  .addEventListener("change", applyFilters);
document
  .getElementById("filter-category")
  .addEventListener("input", applyFilters);

// Function to filter todos based on the filter options
function applyFilters() {
  const priorityValue = document.getElementById("filter-priority-select").value;
  const dateValue = document.getElementById("filter-duedate").value;
  const categoryValue = document
    .getElementById("filter-category")
    .value.trim()
    .toLowerCase();
  const sortBy = document.getElementById("sort-by").value;

  const filteredTodos = todos.filter((todo) => {
    const isPriorityMatch =
      priorityValue === "all" || todo.priority === priorityValue;
    const isDateMatch = dateValue === "" || todo.date === dateValue;
    const isCategoryMatch =
      categoryValue === "" ||
      todo.category.toLowerCase().includes(categoryValue);

    return isPriorityMatch && isDateMatch && isCategoryMatch;
  });

  const sortedTodos = sortTodos(filteredTodos, sortBy);
  renderFilteredTodos(sortedTodos);
}

function renderFilteredTodos(filteredTodos) {
  todolistElement.innerHTML = "";

  filteredTodos.forEach((todo, index) => {
    todolistElement.innerHTML += `
      <div class="todo" id="${index}">
        <i class="bi ${
          todo.checked ? "bi-check-circle-fill" : "bi-circle"
        }" style="color:${todo.color}" data-action="check"></i>
        <span class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</span>
        <span class="${todo.checked ? "checked" : ""}">${todo.date}</span> 
        <span class="priority ${todo.checked ? "checked" : ""}">Priority:${
      todo.priority
    }</span>
        <span class="priority ${todo.checked ? "checked" : ""}">Category:${
      todo.category
    }</span>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
      </div>
    `;
  });
}

function renderTodos() {
  if (todos.length === 0) {
    todolistElement.innerHTML = "<center>Nothing To-Do</center>";
    return;
  }
  //Clear element before a re render

  // todolistElement.innerHTML = "";
  // todos.forEach((todo, index) => {
  //   todolistElement.innerHTML += `
  // <div class ="todo" id =${index}>
  // <i class="bi ${
  //   todo.checked ? "bi-check-circle-fill" : "bi-circle"
  // }" style="color:${todo.color}"  data-action="check"></i>
  // <span class="${ todo.checked ? "checked" : ""} " data-action="check">${todo.value}</span>
  // <span class="${ todo.checked ? "checked" : ""}">${todo.date}</span>
  // <span class="priority ${ todo.checked ? "checked" : ""}">Priority:${todo.priority}</span>
  // <span class="priority ${ todo.checked ? "checked" : ""}">Category:${todo.category}</span>

  // <i class="bi bi-pencil-square" data-action="edit"></i>
  // <i class="bi bi-trash" data-action="delete"></i>
  // </div>
  // `;
  // });

  if (
    prioritySelect.value === "all" &&
    dateInput.value === "" &&
    categoryFilter.value.trim() === ""
  ) {
    renderAllTodos();
  } else {
    applyFilters();
  }
}

function renderAllTodos() {
  todolistElement.innerHTML = "";

  todos.forEach((todo, index) => {
    todolistElement.innerHTML += `
      <div class="todo" id="${index}">
        <i class="bi ${
          todo.checked ? "bi-check-circle-fill" : "bi-circle"
        }" style="color:${todo.color}" data-action="check"></i>
        <span class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</span>
        <span class="${todo.checked ? "checked" : ""}">${todo.date}</span> 
        <span class="priority ${todo.checked ? "checked" : ""}">Priority:${
      todo.priority
    }</span>
        <span class="priority ${todo.checked ? "checked" : ""}">Category:${
      todo.category
    }</span>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
      </div>
    `;
  });
}

//CLICK EVENT LISTENER FOR ALL THE TODOS

todolistElement.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  //getting hold if id
  const todo = parentElement;
  const todoId = Number(todo.id);

  //action on clicking respective icons
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);

  //   console.log(todoId,action);
});

function checkTodo(todoId) {
  let newArr = todos.map((todo, index) => {
    if (index === todoId) {
      return {
        value: todo.value,
        color: todo.color,
        checked: !todo.checked,
        date: todo.date,
        priority: todo.priority,
        category: todo.category,
      };
    } else {
      return {
        value: todo.value,
        color: todo.color,
        checked: todo.checked,
        date: todo.date,
        priority: todo.priority,
        category: todo.category,
      };
    }
  });

  todos = newArr;
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));

  const action = todo.checked ? "Uncheck" : "Check";
  logActivity(action, `Marked task "${todo.value}" as ${action.toLowerCase()}`);
}

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  editId = todoId;

  logActivity("Edit", `Edited task "${todos[todoId].value}"`);
}

function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index != todoId);

  //initialize editTodo=-1 so that if we delete while editing the same id doesn't get rerendered
  editId = -1;
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
  logActivity("Delete", `Deleted task "${todo.value}"`);
}

submitBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  console.log("working");
  addTodo();
  renderTodos();

  localStorage.setItem("todos", JSON.stringify(todos));
});

todoInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    //checks whether the pressed key is "Enter"
    // e.preventDefault();
    console.log("working");
    addTodo();
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});

//sorting
function sortTodos(filteredTodos, sortBy) {
  switch (sortBy) {
    case "duedate":
      return filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "priority":
      return filteredTodos.sort((a, b) => a.priority.localeCompare(b.priority));
    default:
      return filteredTodos;
  }
}

document.getElementById("sort-by").addEventListener("change", function () {
  applyFilters();
});

//activity log

const activityLog = []; // Array to store activity logs

// Function to add an activity log
function logActivity(type, details) {
  const timestamp = new Date().toISOString();
  activityLog.push({ timestamp, type, details });
}

function displayActivityLogs() {
  const activityLogContainer = document.getElementById(
    "activity-log-container"
  );

  let logsHTML = "<h2>Activity Logs</h2>";

  if (activityLog.length === 0) {
    logsHTML += "<p>No activity logs available.</p>";
  } else {
    logsHTML += "<ul>";
    activityLog.forEach((log) => {
      logsHTML += `<li><strong>${log.timestamp}</strong> - ${log.type}: ${log.details}</li>`;
    });
    logsHTML += "</ul>";
  }

  activityLogContainer.innerHTML = logsHTML;
}

const viewLogsBtn = document.getElementById("view-logs-btn");
viewLogsBtn.addEventListener("click", displayActivityLogs);

//search functionalities

// Function for Exact Todo Search
function exactSearch() {
  const exactSearchTerm = document.getElementById("exact-search").value.trim();

  if (exactSearchTerm === "") {
    alert("Please enter a task name to search.");
    return;
  }

  const exactMatch = todos.find((todo) => todo.value === exactSearchTerm);

  if (exactMatch) {
    // Do something with the exactMatch (e.g., display it or mark it as active)
    console.log("Exact match found:", exactMatch);
  } else {
    alert("No exact match found.");
  }
}

// Function for Similar Words Search
function similarSearch() {
  const similarSearchTerm = document
    .getElementById("similar-search")
    .value.trim()
    .toLowerCase();

  if (similarSearchTerm === "") {
    alert("Please enter a search term to find similar tasks.");
    return;
  }

  const similarMatches = todos.filter((todo) =>
    todo.value.toLowerCase().includes(similarSearchTerm)
  );

  if (similarMatches.length > 0) {
    // Do something with the similarMatches (e.g., display them or mark them as active)
    console.log("Similar matches found:", similarMatches);
  } else {
    alert("No similar matches found.");
  }
}

// Function for Partial Search
function partialSearch() {
  const partialSearchTerm = document
    .getElementById("partial-search")
    .value.trim()
    .toLowerCase();

  if (partialSearchTerm === "") {
    alert("Please enter a partial keyword to search.");
    return;
  }

  const partialMatches = todos.filter(
    (todo) => todo.value.toLowerCase().indexOf(partialSearchTerm) !== -1
  );

  if (partialMatches.length > 0) {
    // Do something with the partialMatches (e.g., display them or mark them as active)
    console.log("Partial matches found:", partialMatches);
  } else {
    alert("No partial matches found.");
  }
}

// Add event listeners to the search buttons (you can have separate buttons for each type of search)
document
  .getElementById("exact-search-btn")
  .addEventListener("click", exactSearch);
document
  .getElementById("similar-search-btn")
  .addEventListener("click", similarSearch);
document
  .getElementById("partial-search-btn")
  .addEventListener("click", partialSearch);
