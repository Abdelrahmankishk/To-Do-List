const todoInput = document.getElementById("todoInput");
const todoError = document.getElementById("todoError");
const todoErrorText = document.getElementById("todoErrorText");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const addBtn = document.getElementById("addBtn");
const editInput = document.getElementById("editInput");
const editModalElement = document.getElementById("editModal");
const editError = document.getElementById("editError");

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

    // Assemble the task
    actions.append(editBtn, doneBtn);
    todoItem.append(marker, todoText, actions);

    fragment.appendChild(todoItem);
  });

  // Display all tasks
  todoList.appendChild(fragment);

  // Update empty state
  toggleEmptyState();
}

displayTodos();
