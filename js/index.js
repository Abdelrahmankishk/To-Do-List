const todoInput = document.getElementById("todoInput");
const todoError = document.getElementById("todoError");
const todoErrorText = document.getElementById("todoErrorText");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");

const todoRegex = /\S/;

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
