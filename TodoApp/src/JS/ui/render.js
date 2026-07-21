import { tasksContainer, operationsState, taskAddInput, taskAddBtn } from "../dom.js";
import { state } from "../state/state.js";
import { createTaskElement } from "./elements.js";

export async function renderAllTasks() {
    const tasks = state.tasks;

    tasksContainer.innerHTML = "";

    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = "<p class='empty-msg'>No tasks found. Add a new one!</p>";
        return;
    }

    tasks.forEach((task) => {
        renderTask(task);
    });
}

export function renderTask(task) {
    if (!task) return;
    
    const taskElement = createTaskElement(task);
    tasksContainer.appendChild(taskElement);
}

export function renderResponseStatus(Message) {
    operationsState.textContent = Message;
}

export function toggleUiLoadingState(isLoading) {
    taskAddInput.disabled = isLoading;
    taskAddBtn.disabled = isLoading;
    document.querySelectorAll("button").forEach(btn => btn.disabled = isLoading);
    document.querySelectorAll("input").forEach(input => input.disabled = isLoading);
    if (isLoading) {
        operationsState.textContent = "⌛ please wait...";
        operationsState.classList.add("loading-active");
    } else {
        operationsState.classList.remove("loading-active");
    }
}