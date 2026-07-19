// ui/render.js
import { tasksContainer, operationsState } from "../dom.js";
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