todoMain();

function todoMain() {
  const DEFAULT_OPTION = "choose category";
  let todoList = [];
  let activityLogs = [];
  let inputEle,
    addButton,
    inputEle2,
    selectElem,
    dateInput,
    sortButton,
    shortlistBtn,
    prior,
    sortBtnPrio,
    searchInput,
    searchbtn,
    divtoShow,
    todoTable,
    draggingElement,
    showActivityLogBtn,
    activityLog,
    backlogsbtn;

  getElements();
  addListeners();
  load();
  loadActivityLogs();
  renderRows(todoList);
  updateSelectOptions();

  function getElements() {
    activityLog = document.getElementById("activityLog");
    inputEle = document.getElementsByTagName("input")[1];
    inputEle2 = document.getElementsByTagName("input")[2];
    selectElem = document.getElementById("categoryFilter");
    addButton = document.getElementById("add-btn");
    dateInput = document.getElementById("dateInput");
    prior = document.getElementById("priorityId");
    sortButton = document.getElementById("sortBtn");
    shortlistBtn = document.getElementById("shortlistBtn");
    sortBtnPrio = document.getElementById("sortBtnPrio");
    searchInput = document.getElementById("searchInput");
    searchbtn = document.getElementById("searchbtn");
    showActivityLogBtn = document.getElementById("showActivityLogBtn");
    todoTable = document.getElementById("todoTable");
    backlogsbtn = document.getElementById("backlogsbtn");
  }

  function addListeners() {
    addButton.addEventListener("click", () => {
      addTask();
      viewOriginaltable();
    });
    sortButton.addEventListener("click", sortEntry, false);
    sortBtnPrio.addEventListener("click", sortEntryPrio, false);
    selectElem.addEventListener("change", multipleFilter, false);
    shortlistBtn.addEventListener("change", multipleFilter, false);
    searchbtn.addEventListener("click", searchTodos, false);
    showActivityLogBtn.addEventListener(
      "click",
      function () {
        // Call the updateActivityLog function immediately to display the logs
        updateActivityLog();

        // Delay clearing the logs by 5 seconds
        setTimeout(clearActivityLog, 3000);
      },
      false
    ); //
    backlogsbtn.addEventListener("click", renderBacklogs, false);
    // event delegation
    document
      .getElementById("todoTable")
      .addEventListener("click", onTableClicked, false);
    todoTable.addEventListener("dragstart", onDragstart, false);
    todoTable.addEventListener("drop", onDrop, false);
    todoTable.addEventListener("dragover", onDragOver, false);
  }
  function clearActivityLog() {
    activityLog.innerHTML = ""; // Assuming "activityLog" is the container for the logs
  }
  function addTask(event) {
    if (
      inputEle.value == "" ||
      inputEle2.value == "" ||
      prior.value == "" ||
      dateInput.value == ""
    ) {
      alert("please enter every field");
      return;
    }
    console.log(inputEle2.value);
    let inputValue = inputEle.value;
    //log added

    logActivity(`Task "${inputValue}" added`);

    inputEle.value = "";

    let inputValue2 = inputEle2.value;
    inputEle2.value = "";

    let selectedOption = prior.value;
    let dateValue = dateInput.value;
    dateInput.value = "";
    console.log(prior);
    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      date: dateValue,
      priority: selectedOption,
      done: false,
    };
    renderRow(obj);

    todoList.push(obj);

    save();
    updateSelectOptions();
  }

  function updateSelectOptions() {
    let options = [];
    todoList.forEach((obj) => {
      options.push(obj.category);
    });

    let optionsSet = new Set(options);

    //empty options
    selectElem.innerHTML = "";

    let newOptionElem = document.createElement("option");
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement("option");
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }
  }
  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }
  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    if (todoList === null) {
      todoList = [];
    }
  }
  function viewOriginaltable() {
    clearTable();
    renderRows(todoList);
  }
  function renderRows(arr) {
    arr.forEach((todoObj) => {
      renderRow(todoObj);
    });
  }
  function renderRow({
    id,
    todo: inputValue,
    category: inputValue2,
    date,
    priority: selectedOption,
    done,
  }) {
    //add a new Row
    console.log(todoList);
    let table = document.getElementById("todoTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);
    trElem.draggable = "true";
    trElem.dataset.id = id;
    //checkbox cell,
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem = document.createElement("td");
    tdElem.appendChild(checkboxElem);
    trElem.appendChild(tdElem);

    //date Cell
    let dateElem = document.createElement("td");
    let dateObj = new Date(date);

    dateElem.innerText = date;
    trElem.appendChild(dateElem);
    //priority cell
    let tdprior = document.createElement("td");
    tdprior.innerText = selectedOption;
    trElem.appendChild(tdprior);

    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    //category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem.className = "categoryCell";
    trElem.appendChild(tdElem3);

    // //edit cell

    // let editSpan = document.createElement("span");
    // editSpan.innerText = "edit";
    // editSpan.className = "material-symbols-outlined";
    // editSpan.addEventListener("click", allowEdit, false);
    // editSpan.dataset.id = id;
    // let editTd = document.createElement("td");
    // editTd.appendChild(editSpan);
    // trElem.appendChild(editTd);

    //delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-symbols-outlined";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }
    // For edit on cell feature
    dateElem.dataset.editable = true;
    tdElem2.dataset.editable = true;
    tdElem3.dataset.editable = true;
    tdprior.dataset.editable = true;

    dateElem.dataset.type = "date";
    dateElem.dataset.value = date;
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "category";
    tdprior.dataset.type = "priority";

    dateElem.dataset.id = id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;
    tdprior.dataset.id = id;

    function deleteItem() {
      console.log(tdElem2);
      logActivity(`Task "${tdElem2.innerText}" deleted`);

      trElem.remove();
      updateSelectOptions();
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList.splice(i, 1);
        }
      }

      save();
    }

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList[i]["done"] = this.checked;
        }
      }
      if (this.checked) {
        logActivity(`Task "${tdElem2.innerText}" checked`);
      } else {
        logActivity(`Task "${tdElem2.innerText}" unchecked`);
      }
      console.log(tdElem2.innerText);
      console.log(this.checked);
      save();
    }
  }

  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
  function sortEntry() {
    todoList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate - bDate;
    });

    clearTable();
    console.log(todoList);
    renderRows(todoList);
  }
  function sortEntryPrio() {
    todoList.sort(customSort);
    function customSort(a, b) {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];

      return priorityA - priorityB;
    }
    console.log(todoList);

    clearTable();
    renderRows(todoList);
  }
  function clearTable() {
    //empty the table, keeping the first row
    let trElems = document.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }
  }

  function multipleFilter() {
    clearTable();

    //shortListBtn.checked
    let selection = selectElem.value;
    if (selection == DEFAULT_OPTION) {
      if (shortlistBtn.checked) {
        let filteredIncompArray = todoList.filter((obj) => obj.done == false);
        renderRows(filteredIncompArray);
        let filteredCompArray = todoList.filter((obj) => obj.done == true);
        renderRows(filteredCompArray);
      } else {
        renderRows(todoList);
      }
    } else {
      let filteredCategoryArray = todoList.filter(
        (obj) => obj.category === selection
      );
      if (shortlistBtn.checked) {
        let filteredIncompArray = filteredCategoryArray.filter(
          (obj) => obj.done == false
        );
        renderRows(filteredIncompArray);
        let filteredCompArray = filteredCategoryArray.filter(
          (obj) => obj.done == true
        );
        renderRows(filteredCompArray);
      } else {
        renderRows(filteredCategoryArray);
      }
    }
  }
  function onTableClicked(event) {
    if (event.target.matches("td") && event.target.dataset.editable == "true") {
      let tempInputElem;

      let eventType = event.target.dataset.type;
      switch (event.target.dataset.type) {
        case "date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";
          tempInputElem.value = event.target.dataset.value;

          event.target.appendChild(tempInputElem);

          break;
        case "todo":
        case "category":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;
          event.target.appendChild(tempInputElem);
          break;
        case "priority":
          tempInputElem = document.createElement("select");
          const priorityOptions = ["High", "Medium", "Low"];
          for (const option of priorityOptions) {
            const optionElem = document.createElement("option");
            optionElem.value = option;
            optionElem.innerText = option;
            tempInputElem.appendChild(optionElem);
          }
          tempInputElem.value = event.target.dataset.value;
          event.target.appendChild(tempInputElem);

          break;

        default:
          break;
      }
      let editedValu = event.target.innerText;
      event.target.innerText = "";
      event.target.appendChild(tempInputElem);

      tempInputElem.addEventListener("change", onChange, false);
      function onChange(event) {
        let changedValue = event.target.value;
        const eventType = event.target.parentNode.dataset.type;
        const editedValue = event.target.parentNode.innerText;
        switch (eventType) {
          case "date":
            todoList.forEach((todoObj) => {
              if (todoObj.id === event.target.parentNode.dataset.id) {
                todoObj.date = changedValue;
              }
            });
            break;

          case "todo":
            todoList.forEach((todoObj) => {
              if (todoObj.id === event.target.parentNode.dataset.id) {
                todoObj.todo = changedValue;
              }
            });
            break;

          case "category":
            todoList.forEach((todoObj) => {
              if (todoObj.id === event.target.parentNode.dataset.id) {
                todoObj.category = changedValue;
              }
            });
            break;

          case "priority":
            todoList.forEach((todoObj) => {
              if (todoObj.id === event.target.parentNode.dataset.id) {
                todoObj.priority = changedValue;
              }
            });
            break;

          default:
            break;
        }
        logActivity(
          `"${eventType}" "${editedValu}" edited to "${changedValue}" `
        );

        save();
        event.target.parentNode.innerText = changedValue;

        clearTable();
        renderRows(todoList);
      }
    }
  }

  function searchTodos() {
    console.log(searchInput);
    const searchTerm = searchInput.value.trim().toLowerCase();
    console.log(searchTerm);
    if (searchTerm === "") {
      alert("Please enter something to search");
      return;
    }
    let searchResults = [];
    searchResults = todoList.filter(
      (todo) => todo.todo.toLowerCase().indexOf(searchTerm) !== -1
    );

    console.log(searchResults);
    if (searchResults.length == 0) {
      alert("No such task");
      return;
    } else {
      logActivity(`Task related to "${searchInput.value}"searched`);
    }
    save();
    clearTable();
    renderRows(searchResults);
  }
  //log Activity

  function logActivity(activity) {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    activityLogs.unshift(`[${formattedDate}] ${activity}`);

    //save activity logs to local storage
    saveActivityLogs();
  }

  /// add event listener when button is clicked then only this runs

  function updateActivityLog() {
    // Clear the previous logs
    activityLog.innerHTML = "";

    const headingElement = document.createElement("h3");
    headingElement.innerText = "Activity Logs";

    // Append the heading to the activityLog container
    activityLog.appendChild(headingElement);
    activityLogs.forEach((log) => {
      const li = document.createElement("li");
      li.innerText = log;
      activityLog.appendChild(li);
    });

    //save activity logs to local storage
    saveActivityLogs();
  }
  function saveActivityLogs() {
    let stringifiedLogs = JSON.stringify(activityLogs);
    localStorage.setItem("activityLogs", stringifiedLogs);
  }
  function loadActivityLogs() {
    let retrievedLogs = localStorage.getItem("activityLogs");
    activityLogs = JSON.parse(retrievedLogs);
    if (activityLogs === null) {
      activityLogs = [];
    }
  }
  function renderBacklogs() {
    const backlogs = getBacklogs();
    clearTable();
    renderRows(backlogs);
  }
  function getBacklogs() {
    const today = new Date().toISOString().slice(0, 10);
    const backlogArray = todoList.filter((todo) => {
      const dueDate = new Date(todo.date).toISOString().slice(0, 10);
      return !todo.done && dueDate < today;
    });
    return backlogArray;
  }
  function onDragstart(event) {
    draggingElement = event.target; //trElem
  }
  function onDrop(event) {
    if (event.target.matches("table")) return;
    let beforeTarget = event.target;

    while (!beforeTarget.matches("tr")) beforeTarget = beforeTarget.parentNode;

    //prevent when tr is first row
    if (beforeTarget.matches(":first-child")) return;

    //handling array

    let tempIndex;
    //find the index of one to be taken out
    todoList.forEach((todo, index) => {
      if (todo.id == draggingElement.dataset.id) tempIndex = index;
    });
    //pop the element
    let [toInsertObj] = todoList.splice(tempIndex, 1);

    //find the  one  to be inserted before
    todoList.forEach((todo, index) => {
      if (todo.id == beforeTarget.dataset.id) tempIndex = index;
    });
    //insert the temp
    todoList.splice(tempIndex, 0, toInsertObj);
    todoTable.insertBefore(draggingElement, beforeTarget);
    save();
  }
  function onDragOver(event) {
    event.preventDefault();
  }
}
