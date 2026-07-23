import { tasksContainer, operationsState, taskAddInput, taskAddBtn, taskCount, taskSearchInput } from "../dom.js";
import { state } from "../state/state.js";
import { createTaskElement } from "./elements.js";

export async function renderAllTasks() {
    const tasks = state.tasks;

    tasksContainer.innerHTML = "";

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

export function rendertaskCount(count) {
    taskCount.textContent = `${count}`;
}

export function toggleUiLoadingState(isLoading) {
    taskAddInput.disabled = isLoading;
    taskAddBtn.disabled = isLoading;
    document.querySelectorAll("button").forEach(btn => btn.disabled = isLoading);
    document.querySelectorAll("input:not(#taskSearchInput)").forEach(input => input.disabled = isLoading);
    document.querySelectorAll("select").forEach(select => select.disabled = isLoading)
    if (isLoading) {
        operationsState.textContent = "⌛ please wait...";
        operationsState.classList.add("loading-active");
    } else {
        operationsState.classList.remove("loading-active");
    }
}