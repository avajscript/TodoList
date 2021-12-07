window.addEventListener("DOMContentLoaded", () => {
  // Variables
  const listCatagories = document.querySelectorAll(".white-anim li"),
    newItemButton = document.querySelector("#new-todo-button"),
    newTodoForm = document.querySelector(".new-todo-form"),
    newTodoCancel = document.querySelector("#new-todo-cancel"),
    newTodoSubmit = document.querySelector("#new-todo-submit"),
    allTodos = [],
    thisWeekTodos = [],
    todayTodos = [],
    projects = [],
    newProjectTodo = document.querySelector("#project-new-todo"),
    newProjectButton = document.querySelector("#new-project"),
    newProjectForm = document.querySelector("#new-project-form"),
    newProjectCancel = document.querySelector("#new-project-cancel"),
    newProjectSubmit = document.querySelector("#new-project-submit"),
    viewTodayButton = document.querySelector("#render-today"),
    viewWeekButton = document.querySelector("#render-week"),
    viewAllButton = document.querySelector("#render-all");
  class TODO {
    constructor(title, description, dueDate, time, id, projectId) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.time = time;
      this.id = id;
      this.projectId = projectId;
    }
  }

  class PROJECT {
    constructor(title, id) {
      this.title = title;
      this.id = id;
      this.todos = [];
    }
  }

  // Functions

  function removeActiveStates() {
    const itemSlots = document.querySelectorAll(".white-anim li");
    itemSlots.forEach((item) => {
      item.classList.remove("active-slot");
    });
  }

  function setActiveState(itemSlot) {
    removeActiveStates();
    itemSlot.classList.add("active-slot");
  }

  function preRenderSlot() {
    // If class list contains one of these, don't render todos
    const iconSlot = document.querySelector(".active-slot");
    if (iconSlot === null) {
      return false;
    }
    const timeSlots = ["render-today", "render-week", "render-all"];
    let renderedBool = true;
    if (
      timeSlots.some((id) => {
        return iconSlot.id == id;
      })
    ) {
      // Find index of time slot based on the active slot classes
      let timeSlot = timeSlots.findIndex((time) => {
        return iconSlot.id == time;
      });
      // Set time slot to the correct string based on index
      timeSlot = timeSlots[timeSlot];

      // Render time slot
      switch (timeSlot) {
        case "render-today":
          renderToday();
          break;
        case "render-week":
          renderWeek();
          break;
        case "render-all":
          renderAll();
          break;
      }
      return true;
    } else {
      return false;
    }
  }

  function renderTimeSlot(todos, timeSlot) {
    clearSlot();
    const mainContent = document.querySelector(".main-content");
    const container = document.createElement("div");
    container.classList.add("view-timeslot");
    const dateHolder = document.createElement("div");
    dateHolder.classList.add("date-holder");
    const timeSlotH2 = document.createElement("h2");
    const date = document.createElement("p");

    if (timeSlot == "today") {
      // EDIT THIS
      timeSlotH2.innerText = "TODAY";
      date.innerText = new Date().toDateString().split(" ").join(", ");
    }

    if (timeSlot == "weekly") {
      timeSlotH2.innerText = "THIS WEEK";
      let nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 6);
      date.innerText = `${new Date()
        .toDateString()
        .split(" ")
        .join(", ")} - ${nextWeek.toDateString().split(" ").join(", ")}`;
    }

    if (timeSlot == "all") {
      timeSlotH2.innerText = "All";
      date.innerText = `${new Date()
        .toDateString()
        .split(" ")
        .join(", ")} - Infinity`;
    }

    // Append children
    dateHolder.appendChild(timeSlotH2);
    dateHolder.appendChild(date);

    container.appendChild(dateHolder);

    // Add time slot header to page
    mainContent.insertBefore(container, mainContent.firstChild);

    todos.forEach((todoItem) => {
      let todo = document.createElement("li");
      todo.classList.add("todo-item", "flex-container");

      let leftUl = document.createElement("ul");
      leftUl.classList.add("flex", "left");

      let checkLi = document.createElement("li");
      let check = document.createElement("i");
      check.classList.add("far", "fa-lg", "fa-square", "todo-check");
      checkLi.appendChild(check);

      // Check days left
      let curTime = new Date();
      let dayHoursState, dayHoursValue;
      if (checkDayToday(curTime, todoItem.dueDate)) {
        dayHoursState = "Hours";
        curTime = getHoursSince(curTime);
        todoTime = getHoursSince(todoItem.dueDate);
        dayHoursValue = Math.floor(todoTime - curTime);
        if (dayHoursValue == 1) {
          dayHoursState = "Hour";
        }
      } else {
        dayHoursState = "Days";
        curTime = getDaysSince(curTime);
        todoTime = getDaysSince(todoItem.dueDate);
        dayHoursValue = Math.floor(todoTime - curTime);
        if (dayHoursValue == 1) {
          dayHoursValue = "Day";
        }
      }

      //let daysHours =

      let titleLi = document.createElement("li");
      let titlePara = document.createElement("p");
      titlePara.innerText = todoItem.title;
      titleLi.appendChild(titlePara);

      // Add children to left ul
      leftUl.appendChild(checkLi);
      leftUl.appendChild(titleLi);

      let rightUl = document.createElement("ul");
      rightUl.classList.add("right");

      let view = document.createElement("li");
      view.classList.add("view");
      view.innerText = "view";

      let clockLi = document.createElement("li");
      let clock = document.createElement("i");
      clock.classList.add("fas", "fa-clock");
      clockLi.appendChild(clock);

      let timeLeftLi = document.createElement("li");
      timeLeftPara = document.createElement("p");
      timeLeftPara.style.minWidth = "110px";
      timeLeftPara.innerText = `${dayHoursValue} ${dayHoursState} left`; //EDIT
      timeLeftLi.appendChild(timeLeftPara);

      let editLi = document.createElement("li");
      editLi.classList.add("icon-hover");
      let edit = document.createElement("i");
      edit.classList.add("fas", "fa-edit");
      editLi.appendChild(edit);

      let deleteLi = document.createElement("li");
      deleteLi.classList.add("icon-hover");
      deleteLi.addEventListener("click", () => {
        deleteTodo(todoItem);
      });
      let remove = document.createElement("i");
      remove.classList.add("fas", "fa-trash-alt");
      deleteLi.appendChild(remove);

      // Append children to right ul
      rightUl.appendChild(view);
      rightUl.appendChild(clockLi);
      rightUl.appendChild(timeLeftLi);
      rightUl.appendChild(editLi);
      rightUl.appendChild(deleteLi);

      //Append Children to todo item
      todo.appendChild(leftUl);
      todo.appendChild(rightUl);

      document.querySelector(".view-timeslot").appendChild(todo);
    });
  }
  function renderToday() {
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();

    const todayTodos = allTodos.filter((todo) => {
      if (
        todo.dueDate.getFullYear() == curYear &&
        todo.dueDate.getMonth() == curMonth &&
        todo.dueDate.getDate() == curDay
      ) {
        return true;
      }
    });
    renderTimeSlot(todayTodos, "today");
  }
  function renderWeek() {
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);

    let weekTodos = allTodos.filter((todo) => {
      if (
        (function () {
          // Check if today
          if (todo.dueDate.getDate() == curDate.getDate()) {
            return true;
          }
          // Check if this week
          for (let i = 0; i < 6; i++) {
            curDate.setDate(curDate.getDate() + 1);
            if (todo.dueDate.getDate() == curDate.getDate()) {
              return true;
            }
          }
        })()
      ) {
        // If function == true, then return true for filter
        return true;
      }
    });
    renderTimeSlot(weekTodos, "weekly");
  }
  function renderAll() {
    renderTimeSlot(allTodos, "all");
  }

  function clearSlot() {
    const mainContent = document.querySelector(".main-content");
    mainContent.removeChild(mainContent.childNodes[0]);
  }
  function resetAllTodosId() {
    allTodos.forEach((todo, index) => {
      todo.id = index + 1;
    });
    console.log(allTodos);
  }
  function getDaysSince(date) {
    return date.getTime() / 1000 / 60 / 60 / 24;
  }

  function getHoursSince(date) {
    return date.getTime() / 1000 / 60 / 60;
  }
  function checkDayToday(date, todoDate) {
    if (date.getFullYear() !== todoDate.getFullYear()) {
      return false;
    }
    // Check if same month
    if (date.getMonth() == todoDate.getMonth()) {
      // Check if same day
      if (date.getDate() == todoDate.getDate()) {
        return true;
      }
    }
    return false;
  }

  function deleteTodo(todo) {
    // Delete todo from all todos list
    let delIndex = allTodos.findIndex((curTodo) => {
      return todo.id == curTodo.id;
    });
    allTodos.splice(delIndex, 1);

    // Delete from project if todo contains project id
    if (todo.projectId !== undefined) {
      // Delete todo from project
      let projDelIndex = projects.findIndex((project) => {
        return project.id == todo.projectId;
      });

      let projTodoDelIndex = projects[projDelIndex].todos.findIndex(
        (curTodo) => {
          return todo.id == curTodo.id;
        }
      );

      projects[projDelIndex].todos.splice(projTodoDelIndex, 1);

      const renderProjectBool = preRenderSlot();
      if (renderProjectBool) {
      } else {
        renderTodos(todo.projectId);
      }
    } else {
      preRenderSlot();
    }
    resetAllTodosId();
  }

  // Render ids from current project
  function renderTodos(id) {
    const project = document.querySelector(".view-project");
    // Find project based on id
    const todosProject = projects.find((project) => {
      return id == project.id;
    });

    todos = todosProject.todos;

    const projectUl = project.querySelector(".project-todo-list");
    projectUl.innerHTML = "";

    // Create todo list item and add styles
    todos.forEach((todoItem) => {
      let todo = document.createElement("li");
      todo.classList.add("todo-item", "flex-container");

      let leftUl = document.createElement("ul");
      leftUl.classList.add("flex", "left");

      let checkLi = document.createElement("li");
      let check = document.createElement("i");
      check.classList.add("far", "fa-lg", "fa-square", "todo-check");
      checkLi.appendChild(check);

      // Check days left
      let curTime = new Date();
      let dayHoursState, dayHoursValue;
      if (checkDayToday(curTime, todoItem.dueDate)) {
        dayHoursState = "Hours";
        curTime = getHoursSince(curTime);
        todoTime = getHoursSince(todoItem.dueDate);
        dayHoursValue = Math.floor(todoTime - curTime);
        console.log(dayHoursValue);
        if (dayHoursValue == 1) {
          dayHoursState = "Hour";
        }
      } else {
        dayHoursState = "Days";
        curTime = getDaysSince(curTime);
        todoTime = getDaysSince(todoItem.dueDate);
        dayHoursValue = Math.floor(todoTime - curTime);
        if (dayHoursValue == 1) {
          dayHoursState = "Day";
        }
      }

      //let daysHours =

      let titleLi = document.createElement("li");
      let titlePara = document.createElement("p");
      titlePara.innerText = todoItem.title;
      titleLi.appendChild(titlePara);

      // Add children to left ul
      leftUl.appendChild(checkLi);
      leftUl.appendChild(titleLi);

      let rightUl = document.createElement("ul");
      rightUl.classList.add("right");

      let view = document.createElement("li");
      view.classList.add("view");
      view.innerText = "view";

      let clockLi = document.createElement("li");
      let clock = document.createElement("i");
      clock.classList.add("fas", "fa-clock");
      clockLi.appendChild(clock);

      let timeLeftLi = document.createElement("li");
      timeLeftPara = document.createElement("p");
      timeLeftPara.style.minWidth = "110px";
      timeLeftPara.innerText = `${dayHoursValue} ${dayHoursState} left`; //EDIT
      timeLeftLi.appendChild(timeLeftPara);

      let editLi = document.createElement("li");
      editLi.classList.add("icon-hover");
      let edit = document.createElement("i");
      edit.classList.add("fas", "fa-edit");
      editLi.appendChild(edit);

      let deleteLi = document.createElement("li");
      deleteLi.classList.add("icon-hover");
      deleteLi.addEventListener("click", () => {
        deleteTodo(todoItem);
      });
      let remove = document.createElement("i");
      remove.classList.add("fas", "fa-trash-alt");
      deleteLi.appendChild(remove);

      // Append children to right ul
      rightUl.appendChild(view);
      rightUl.appendChild(clockLi);
      rightUl.appendChild(timeLeftLi);
      rightUl.appendChild(editLi);
      rightUl.appendChild(deleteLi);

      //Append Children to todo item
      todo.appendChild(leftUl);
      todo.appendChild(rightUl);

      projectUl.appendChild(todo);
    });
  }

  // Display todos on screen from current project
  function renderProject(id) {
    const mainContent = document.querySelector(".main-content");
    mainContent.removeChild(mainContent.childNodes[0]);
    const project = document.createElement("div");
    project.classList.add("view-project");
    project.innerHTML = "";

    let header = document.createElement("header");
    let projectTitle = document.createElement("h2");
    projectTitle.id = "current-title";

    let projectContent = document.createElement("div");
    projectContent.classList.add("project-content");

    let projectUl = document.createElement("ul");
    projectUl.classList.add("project-todo-list");

    let newTodoIcon = document.createElement("i");
    newTodoIcon.id = "project-new-todo";
    newTodoIcon.classList.add("fas", "fa-plus-square", "fa-3x");
    newTodoIcon.addEventListener("click", (e) => {
      //let projectTitle = document.querySelector('#current-title');
      // Send project title to open new todo page
      openNewTodo(e, projectTitle.innerText);
    });
    // Append children in order
    projectContent.appendChild(projectUl);
    projectContent.appendChild(newTodoIcon);

    header.appendChild(projectTitle);

    project.appendChild(header);
    project.appendChild(projectContent);
    // Match project id

    let curProject = projects.find((pro) => {
      return pro.id === parseInt(id);
    });
    // Set new values for classes/titles

    project.id = `project-${curProject.id}`;
    projectTitle.innerText = curProject.title;

    mainContent.insertBefore(project, mainContent.firstChild);

    // Display todos to match project title

    renderTodos(id);
  }
  function appendProject(project) {
    const projectListElem = document.querySelector(".project-list"),
      whiteAnim = projectListElem.querySelector(".white-anim");

    let li = document.createElement("li");
    li.classList.add("project");

    let h2 = document.createElement("h2");
    h2.innerText = project.title;
    let i = document.createElement("i");
    i.classList.add("fas", "fa-times", "fa-lg", "del-project");

    li.addEventListener("click", hideForms);

    // Active on click
    li.addEventListener("click", (e) => {
      setActiveState(e.currentTarget);
    });

    // Hover animation
    li.addEventListener("mouseover", (e) => {
      whiteAnimToggle(e, true);
    });

    li.addEventListener("mouseout", (e) => {
      whiteAnimToggle(e, false);
    });

    // Display project on click
    li.addEventListener("click", () => {
      renderProject(project.id);
    });

    li.appendChild(h2);
    li.appendChild(i);
    whiteAnim.appendChild(li);
    projectListElem.appendChild(whiteAnim);
    // Set project to active when created
    setActiveState(li);
  }

  function createNewProject(title) {
    const id = projects.length + 1;
    const project = new PROJECT(title, id);
    // Push to projects list
    projects.push(project);
    // Draw to screen
    appendProject(project);
    renderProject(project.id);
  }

  // Checks if project is valid when submit is clicked on new project form
  function checkNewProject() {
    const title = document.querySelector("#new-project-title");

    // Valid
    if (title.value.length > 0 && title.value.length < 20) {
      title.style.border = "1px solid #2B2D42";
      createNewProject(title.value);
      title.value = "";

      // Invalid
    } else {
      title.style.border = "2px solid #EF233C";
    }
  }

  // Opens and closes new project form
  function openNewProject() {
    newProjectForm.classList.toggle("new-todo-active");
  }

  // Final step in submitting todo
  function createTodo(title, description, date, time, project) {
    let newTodo,
      projIndex,
      projTodoBool = false;
    const index = allTodos.length + 1;
    if (project !== undefined) {
      // POSSIBLE FIX
      projIndex = projects.findIndex((projectItem) => {
        return projectItem.id == parseInt(project);
      });
      newTodo = new TODO(
        title.value,
        description.value,
        date,
        time,
        index,
        projIndex + 1
      );
      projects[projIndex].todos.push(newTodo);
      projTodoBool = true;
    } else {
      newTodo = new TODO(title.value, description.value, date, time, index);
    }

    allTodos.push(newTodo);
    if (projTodoBool) {
      renderTodos(projIndex + 1);
    } else {
      preRenderSlot();
    }
  }

  function checkIfProject() {
    let projectState = document.querySelector("#new-todo-project-title");
    return projectState.innerText == "" ? false : true;
  }

  // After new todo is submitted, check date/time fields
  function checkDate(date, time) {
    const timeInput = document.querySelector("#new-todo-time"),
      dateInput = document.querySelector("#new-todo-date"),
      title = document.querySelector("#new-todo-title"),
      description = document.querySelector("#new-todo-description");

    let validDate = true,
      projectId = document.querySelector(".view-project");
    let userDate = date.value.split("-");
    let userTime = time.value.split(":");

    userDate = new Date(
      userDate[0],
      userDate[1] - 1,
      userDate[2],
      userTime[0],
      userTime[1],
      0
    );
    const curDate = new Date();

    // Check current time in milliseconds compared to user entered time to see if the date is in the future

    const userDateMil = userDate.getTime(),
      curDateMil = curDate.getTime();

    const timeDif = userDateMil - curDateMil;

    dateInput.classList.remove("invalid-input");
    timeInput.classList.remove("invalid-input");
    // Check if user time is one minute or less than the current timecode
    if (timeDif <= 60000) {
      // if day of user input day of month less than current day of month
      if (userDate.getDate() < curDate.getDate()) {
        dateInput.classList.add("invalid-input");
        validDate = false;
      } else {
        timeInput.classList.add("invalid-input");
        validDate = false;
      }
    } else {
      validDate = true;
    }

    if (validDate == true) {
      // Create project todo
      if (checkIfProject()) {
        // If the date is correct and is project

        projectId = projectId.id;
        projectId = projectId.match(/[0-9]+/g);
        createTodo(title, description, userDate, userTime, projectId);
        renderProject(projectId);

        // Create base todo
      } else {
        createTodo(title, description, userDate, userTime);

        //renderTodos(projectId);
      }
    }
  }

  // Checks if fields are valid when new todo form submit clicked
  function checkTodoValid() {
    const title = document.querySelector("#new-todo-title"),
      description = document.querySelector("#new-todo-description"),
      date = document.querySelector("#new-todo-date"),
      time = document.querySelector("#new-todo-time");

    checkDate(date, time);
  }

  // Closes new todo form
  function hideForms() {
    newTodoForm.classList.remove("new-todo-active");
    newProjectForm.classList.remove("new-todo-active");
  }
  // Opens new todo form
  function openNewTodo(event, project) {
    // If todo is open, close it
    if (newTodoForm.classList.contains("new-todo-active")) {
      newTodoForm.classList.remove("new-todo-active");
    } else {
      // Not open, so open it
      newTodoForm.classList.add("new-todo-active");
      // Remove text from project title heading
      let projectTitle = newTodoForm.querySelector("#new-todo-project-title");
      projectTitle.innerText = "";
      if (project !== undefined) {
        // If project is undefined, this is not part of a project
        projectTitle.innerText = project;
      }
    }
  }

  function whiteAnimToggle(e, mouseOver) {
    const catagoryLi = e.currentTarget;

    if (mouseOver == true) {
      catagoryLi.classList.add("white-bg", "padding-left");
    } else {
      catagoryLi.classList.remove("white-bg", "padding-left");
    }
  }

  // Event listeners

  // New todo button
  newItemButton.addEventListener("click", openNewTodo);
  // Close todo
  newTodoCancel.addEventListener("click", openNewTodo);
  // Checks todo valid on submit
  newTodoSubmit.addEventListener("click", checkTodoValid);
  newProjectButton.addEventListener("click", openNewProject);
  // Close new project
  newProjectCancel.addEventListener("click", openNewProject);
  // Submit project and check validity
  newProjectSubmit.addEventListener("click", checkNewProject);

  viewTodayButton.addEventListener("click", renderToday);
  viewWeekButton.addEventListener("click", renderWeek);
  viewAllButton.addEventListener("click", renderAll);
  //Goes through each list item and adds hover classes
  listCatagories.forEach((catagory) => {
    catagory.addEventListener("click", (e) => {
      setActiveState(e.currentTarget);
    });

    catagory.addEventListener("click", (e) => {
      hideForms();
    });

    catagory.addEventListener("mouseover", (e) => {
      whiteAnimToggle(e, true);
    });

    catagory.addEventListener("mouseout", (e) => {
      whiteAnimToggle(e, false);
    });
  });
});
