const todoInput = document.getElementById("todoInput");
const todoError = document.getElementById("todoError");
const todoErrorText = document.getElementById("todoErrorText");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const addBtn = document.getElementById("addBtn");
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

  emptyState.classList.toggle("d-none", todos.length > 0);
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  // Validate input
  if (!validateTodoInput()) return;

  // Create new todo object
  const newTodo = {
    id: Date.now(),
    text: todoInput.value.trim(),
  };

  // Add todo to the array
  todos.push(newTodo);

  // Save updated array
  saveTodos();

  // Reset input
  todoInput.value = "";
  todoError.classList.add("d-none");
  todoInput.classList.remove("is-invalid");
}
addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});
