import { tasksContainer, operationsState } from "../dom.js";
import { state } from "../state/state.js";
import { createTaskElement } from "./elements.js";

export async function renderAllTasks() {
    const tasks = state.tasks;

    if(!tasks || tasks.length === 0) {
        renderResponseStatus("Failed to fetch tasks. Please try again.")
        return
    }

    tasksContainer.innerHTML = ""; 
    operationsState.textContent = ""; 

    tasks.forEach((task) => {
        renderTask(task);
    });
}

export function renderTask(task) {
    if (!task) {
        renderResponseStatus("Failed to render task. Please try again.")
        return;
    }
    const taskElement = createTaskElement(task)
    tasksContainer.appendChild(taskElement)
}

export function renderResponseStatus(Message) {
    operationsState.textContent = Message || "No response from the server. Please check your network connection.";
}