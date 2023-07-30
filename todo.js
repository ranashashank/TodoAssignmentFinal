todoMain();

function todoMain() {
  const DEFAULT_OPTION = "choose category";
  let todoList = [];
  let activityLogs = [];
  let subtask = [];
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
    backlogsbtn,
    subtasksInput;

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
    subtasksInput = document.getElementById("subtasks");
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
    const addSubtaskBtn = document.getElementById("addSubtaskBtn");
  }
  function clearActivityLog() {
    activityLog.innerHTML = ""; // Assuming "activityLog" is the container for the logs
  }
  function addTask(event) {
    console.log(inputEle2.value);
    let inputValue = inputEle.value;
    //log added
    let task = extractTodoFromTodoInput(inputValue);
    logActivity(`Task "${inputValue}" added`);

    let subtasks = subtasksInput.value.split(",");
    console.log(subtasks);
    subtasksInput.value = "";
    inputEle.value = "";

    let inputValue2 = inputEle2.value;
    inputEle2.value = "";

    let selectedOption = prior.value;

    let reminderValue = document.getElementById("reminderInput").value;
    document.getElementById("reminderInput").value;
    console.log(prior);

    // Check for duplicate todo before adding
    if (todoList.length > 0) {
      const isDuplicate = todoList.some(
        (todoObj) => todoObj.todo.toLowerCase() === task.toLowerCase()
      );
      if (isDuplicate) {
        alert("Todo with the same name and category already exists.");
        return;
      }
    }

    // Extract the due date from the input value
    let dateValue = extractDateFromTodoInput(inputValue);
    console.log(dateValue);
    // If no valid date found in the input, use the date input field value
    if (!dateValue) {
      dateValue = dateInput.value;
    }
    dateInput.value = "";
    let obj = {
      id: _uuid(),
      todo: task,
      category: inputValue2,
      date: dateValue,
      priority: selectedOption,
      done: false,
      reminder: reminderValue,
      subtask: subtasks,
    };
    if (inputValue == "") {
      alert("please enter  Todo");
      return;
    }
    if (inputValue2 == "") {
      alert("please enter category");
      return;
    }
    if (dateValue == "") {
      alert("please enter  date");
      return;
    }
    if (selectedOption == "") {
      alert("please enter priority");
      return;
    }
    // if (
    //   inputValue == "" ||
    //   inputValue2 == "" ||
    //   selectedOption == "" ||
    //   dateValue == ""
    // ) {
    //   alert("please enter every field");
    //   return;
    // }
    console.log(obj);
    renderRow(obj);
    checkReminders();
    todoList.push(obj);

    save();
    updateSelectOptions();
  }
  function extractTodoFromTodoInput(inputValue) {
    // Extract the todo text from the input value by removing the date information
    return inputValue
      .replace(
        /by\s+(tomorrow|today|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}(?:\s+\d{1,2}:\d{2}(?:\s+[ap]m)?)?)/i,
        ""
      )
      .trim();
  }

  function extractDateFromTodoInput(inputValue) {
    // Extract the due date information from the input value
    const dateRegex =
      /by\s+(tomorrow|today|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}(?:\s+\d{1,2}:\d{2}(?:\s+[ap]m)?)?)/i;
    const match = inputValue.match(dateRegex);

    if (match) {
      const dateInput = match[1].toLowerCase();
      if (dateInput === "tomorrow") {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        return currentDate.toISOString().slice(0, 10);
      } else if (dateInput === "today") {
        const currentDate = new Date();
        return currentDate.toISOString().slice(0, 10);
      } else {
        const dateAndTimeRegex =
          /(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\s+(\d{1,2}:\d{2}(?:\s+[ap]m)?)/;
        const dateMatch = dateInput.match(dateAndTimeRegex);

        if (dateMatch) {
          const [, day, month, time] = dateMatch;
          const year = extractYear(inputValue);
          const dateValue = `${year}-${monthToNumber(month)}-${day.padStart(
            2,
            "0"
          )}`;
          const dueDate = new Date(dateValue + " " + time);
          return dueDate.toISOString().slice(0, 10);
        } else {
          const dateWithoutBy = dateInput.replace(/by\s+/, "");
          const dateOnlyRegex =
            /(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/i;
          const dateOnlyMatch = dateWithoutBy.match(dateOnlyRegex);

          if (dateOnlyMatch) {
            const [, day, month] = dateOnlyMatch;
            const year = extractYear(inputValue);
            const dateValue = `${year}-${monthToNumber(month)}-${day.padStart(
              2,
              "0"
            )}`;
            const dueDate = new Date(dateValue);
            console.log(dueDate);
            if (dueDate != "Invalid Date")
              return dueDate.toISOString().slice(0, 10);
          }
        }
      }
    }
    // If no date information found, return an empty string
    return "";
  }

  function extractYear(inputValue) {
    // Extract the year from the input value
    const yearRegex = /\d{4}/;
    const yearMatch = inputValue.match(yearRegex);
    if (yearMatch) {
      return yearMatch[0];
    }
    // If no year found, return the current year
    const currentDate = new Date();
    return currentDate.getFullYear().toString();
  }

  function monthToNumber(month) {
    const months = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12",
    };
    return months[month.toLowerCase()];
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
    checkReminders();
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
    reminder,
    subtask: subtasks,
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

    // Reminder cell
    let tdElem5 = document.createElement("td");
    tdElem5.innerText = reminder;
    trElem.appendChild(tdElem5);

    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }
    // // Subtasks cell
    let subtasksTd = document.createElement("td");
    let subtasksList = document.createElement("ul");

    console.log(subtasks);
    subtasks.forEach((subtask, ind) => {
      let subtaskItem = document.createElement("li");

      // Create a container to hold the subtask text and buttons
      let subtaskContainer = document.createElement("div");

      // Subtask text
      let subtaskText = document.createElement("span");
      subtaskText.innerText = subtask;
      subtaskContainer.appendChild(subtaskText);

      // Add checkbox
      let checkboxsub = document.createElement("input");
      checkboxsub.type = "checkbox";
      checkboxsub.addEventListener(
        "click",
        checkboxClicksubtaskCallback,
        false
      );
      subtaskContainer.appendChild(checkboxsub);

      // Add an edit button for each subtask
      let editSubtaskButton = document.createElement("button");
      editSubtaskButton.innerText = "Edit";
      editSubtaskButton.addEventListener("click", () => {
        editSubtask(subtaskItem, ind, id);
      });
      subtaskContainer.appendChild(editSubtaskButton);

      function checkboxClicksubtaskCallback() {
        subtaskItem.classList.toggle("strike");
        save();
      }

      subtaskItem.appendChild(subtaskContainer);
      subtasksList.appendChild(subtaskItem);
    });
    subtasksTd.appendChild(subtasksList);
    trElem.appendChild(subtasksTd);

    // update the subtask
    let subtasksTdButton = document.createElement("td");
    let subtaskButton = document.createElement("button");
    subtaskButton.innerText = "Update Subtask";
    subtaskButton.addEventListener("click", updateSubtask);
    subtasksTdButton.appendChild(subtaskButton);
    trElem.appendChild(subtasksTdButton);

    function updateSubtask() {
      // Prompt the user for input
      const userInput = window.prompt(
        "Enter subtasks separated by commas:",
        subtasks.join(", ")
      );

      if (userInput !== null) {
        // Split the input into an array of subtasks
        const newSubtasks = userInput
          .split(",")
          .map((subtask) => subtask.trim());

        // Remove any empty subtasks
        const filteredSubtasks = newSubtasks.filter(
          (subtask) => subtask !== ""
        );

        // Update the subtask array
        subtasks = filteredSubtasks;

        // Clear existing subtasks in the list
        subtasksList.innerHTML = "";

        // Create new subtask elements based on the updated subtasks array
        filteredSubtasks.forEach((subtask, ind) => {
          let subtaskItem = document.createElement("li");

          // Create a container to hold the subtask text and buttons
          let subtaskContainer = document.createElement("div");

          // Subtask text
          let subtaskText = document.createElement("span");
          subtaskText.innerText = subtask;
          subtaskContainer.appendChild(subtaskText);

          // Add checkbox
          let checkboxsub = document.createElement("input");
          checkboxsub.type = "checkbox";
          checkboxsub.addEventListener(
            "click",
            checkboxClicksubtaskCallback,
            false
          );
          subtaskContainer.appendChild(checkboxsub);

          // Add an edit button for each subtask
          let editSubtaskButton = document.createElement("button");
          editSubtaskButton.innerText = "Edit";
          editSubtaskButton.addEventListener("click", () => {
            editSubtask(subtaskItem, ind, id);
          });
          subtaskContainer.appendChild(editSubtaskButton);

          function checkboxClicksubtaskCallback() {
            subtaskItem.classList.toggle("strike");
            save();
          }

          subtaskItem.appendChild(subtaskContainer);
          subtasksList.appendChild(subtaskItem);
        });
      }
    }
    // For edit on cell feature
    dateElem.dataset.editable = true;
    tdElem2.dataset.editable = true;
    tdElem3.dataset.editable = true;
    tdprior.dataset.editable = true;
    tdElem5.dataset.editable = true;

    dateElem.dataset.type = "date";
    dateElem.dataset.value = date;
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "category";
    tdprior.dataset.type = "priority";
    tdElem5.dataset.type = "remindertype";
    tdElem5.dataset.value = reminder;
    console.log(reminder);

    dateElem.dataset.id = id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;
    tdprior.dataset.id = id;
    tdElem5.dataset.id = id;

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
  function editSubtask(subtaskItem, subtaskIndex, mainTaskId) {
    const spanElement = subtaskItem.children[0].querySelector("span");
    const editedSubtask = prompt("Edit Subtask:", spanElement.innerText);
    if (editedSubtask !== null && editedSubtask.trim() !== "") {
      const mainTaskObj = todoList.find((todoObj) => todoObj.id === mainTaskId);

      // Update the subtask in the main task object's subtasks array
      mainTaskObj.subtask[subtaskIndex] = editedSubtask;
      clearTable();
      renderRows(todoList);

      // Save the changes to local storage and update the table
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
        case "remindertype":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "datetime-local";
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
          case "remindertype":
            todoList.forEach((todoObj) => {
              console.log(changedValue);
              if (todoObj.id === event.target.parentNode.dataset.id) {
                todoObj.reminder = changedValue;
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
      viewOriginaltable();
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
  function checkReminders() {
    const currentTime = new Date().getTime();
    const reminderTasks = todoList.filter((task) => {
      const reminderTime = new Date(task.reminder).getTime();
      return !task.done && reminderTime <= currentTime;
    });

    reminderTasks.forEach((task) => {
      alert(`Reminder: "${task.todo}" to be done before "${task.reminder}"`);
      // Add any other logic you want to handle the reminder, such as playing a sound or showing a notification.
    });
  }
}
