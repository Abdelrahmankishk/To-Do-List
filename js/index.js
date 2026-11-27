const todoInput = document.getElementById("todoInput");
const todoError = document.getElementById("todoError");
const todoErrorText = document.getElementById("todoErrorText");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const addBtn = document.getElementById("addBtn");
const editInput = document.getElementById("editInput");
const editModalElement = document.getElementById("editModal");
const editError = document.getElementById("editError");
const editErrorText = document.getElementById("editErrorText");
const saveEditBtn = document.getElementById("saveEditBtn");
const searchInput = document.getElementById("searchInput");

let currentEditingTodoId = null;
const todoRegex = /\S/;
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function validateTodoInput() {
  const isValid = todoRegex.test(todoInput.value);

  // Update input styling
  todoInput.classList.toggle("is-invalid", !isValid);

  // Update validation message
  todoError.classList.toggle("d-none", isValid);

  if (!isValid) {
    todoErrorText.textContent = "Please enter a valid to-do.";
    todoInput.setAttribute("aria-invalid", "true");
  } else {
    todoInput.removeAttribute("aria-invalid");
  }

  return isValid;
}
function toggleEmptyState() {
  const visibleTodos = todoList.querySelectorAll(".todo-item:not(.d-none)");

  emptyState.classList.toggle("d-none", visibleTodos.length > 0);
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  if (!validateTodoInput()) return;

  const newTodo = {
    id: Date.now(),
    text: todoInput.value.trim(),
  };

  todos.push(newTodo);
  saveTodos();

  displayTodos();

  todoInput.value = "";
  todoError.classList.add("d-none");
  todoInput.classList.remove("is-invalid");
}

todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

function displayTodos() {
  // Clear existing tasks
  todoList.innerHTML = "";

  // Create a fragment to improve DOM performance
  const fragment = document.createDocumentFragment();

  todos.forEach((todo) => {
    // Create the list item
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";
    todoItem.dataset.id = todo.id;

    // Todo marker
    const marker = document.createElement("span");
    marker.className = "todo-marker";

    const markerIcon = document.createElement("i");
    markerIcon.className = "fa-solid fa-check";
    marker.appendChild(markerIcon);

    // Todo text
    const todoText = document.createElement("p");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    // Actions container
    const actions = document.createElement("div");
    actions.className = "todo-actions";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-action btn-edit";
    editBtn.setAttribute("aria-label", "Edit to-do");
    editBtn.title = "Edit";

    // Handle edit button click
    editBtn.addEventListener("click", function () {
      // Store the selected task ID
      currentEditingTodoId = todo.id;

      // Load existing task text
      editInput.value = todo.text;

      // Reset previous validation state
      editInput.classList.remove("is-invalid");
      editInput.removeAttribute("aria-invalid");
      editError.classList.add("d-none");

      // Open Bootstrap modal
      bootstrap.Modal.getOrCreateInstance(editModalElement).show();
    });

    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen";
    editBtn.appendChild(editIcon);

    // Complete button
    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "btn-action btn-done";
    doneBtn.setAttribute("aria-label", "Mark as completed");
    doneBtn.title = "Mark as completed";

    const doneIcon = document.createElement("i");
    doneIcon.className = "fa-solid fa-check";
    doneBtn.appendChild(doneIcon);

    doneBtn.addEventListener("click", function () {
      completeTodo(todo.id, todoItem);
    });

    // Assemble the task
    actions.append(editBtn, doneBtn);
    todoItem.append(marker, todoText, actions);

    fragment.appendChild(todoItem);
  });

  // Display all tasks
  todoList.appendChild(fragment);

  // Apply current search filter
  searchTodos();
}

displayTodos();

function saveEdit() {
  // Validate edited input
  if (!validateEditInput()) return;

  // Make sure a task is selected
  if (currentEditingTodoId === null) return;

  // Find the selected task
  const selectedTodo = todos.find((todo) => todo.id === currentEditingTodoId);

  if (!selectedTodo) return;

  // Update task text
  selectedTodo.text = editInput.value.trim();

  // Save changes to Local Storage
  saveTodos();

  // Refresh the displayed tasks
  displayTodos();

  // Close the modal
  bootstrap.Modal.getOrCreateInstance(editModalElement).hide();
}

// Validate edit input while typing
editInput.addEventListener("input", validateEditInput);

// Save edited task
saveEditBtn.addEventListener("click", saveEdit);

editModalElement.addEventListener("hidden.bs.modal", function () {
  currentEditingTodoId = null;

  editInput.value = "";
  editInput.classList.remove("is-invalid");
  editInput.removeAttribute("aria-invalid");

  editError.classList.add("d-none");
});

function validateEditInput() {
  const isValid = todoRegex.test(editInput.value);

  // Update input styling
  editInput.classList.toggle("is-invalid", !isValid);

  // Update validation message
  editError.classList.toggle("d-none", isValid);

  if (!isValid) {
    editErrorText.textContent = "Please enter a valid to-do.";
    editInput.setAttribute("aria-invalid", "true");
  } else {
    editInput.removeAttribute("aria-invalid");
  }

  return isValid;
}

function completeTodo(todoId, todoElement) {
  // Prevent completing the same task more than once
  if (todoElement.classList.contains("completed")) return;

  // Find the selected task in the array
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) return;

  // Remove the task from the array
  todos.splice(todoIndex, 1);

  // Update Local Storage immediately
  saveTodos();

  // Listen for the completion animation
  function handleFadeAway(event) {
    // Ignore animations coming from child elements
    if (event.target !== todoElement || event.animationName !== "fadeAway") {
      return;
    }

    // Remove the event listener
    todoElement.removeEventListener("animationend", handleFadeAway);

    // Remove the HTML element after animation
    todoElement.remove();

    // Update empty state
    toggleEmptyState();
  }

  todoElement.addEventListener("animationend", handleFadeAway);

  // Trigger the CSS animation
  todoElement.classList.add("completed");
}

function searchTodos() {
  // Get search value
  const searchValue = searchInput.value.trim().toLowerCase();

  // Get all displayed task elements
  const todoItems = todoList.querySelectorAll(".todo-item");

  todoItems.forEach((todoItem) => {
    // Get task text
    // Don't filter tasks that are currently completing
    if (todoItem.classList.contains("completed")) return;
    const todoText = todoItem
      .querySelector(".todo-text")
      .textContent.toLowerCase();

    // Check if task matches search value
    const isMatch = todoText.includes(searchValue);

    // Hide or show task
    todoItem.classList.toggle("d-none", !isMatch);
  });

  // Update empty state
  toggleEmptyState();
}
