import { tasksContainer, operationsState } from "../dom.js";
import { state } from "../state/state.js";
import { createTaskElement } from "./elements.js";
import { checkResponseStatus } from "../utils/helpers.js";

export async function renderAllTasks() {
    const tsks = state.tasks; 

    if (!checkResponseStatus(tsks, "Failed to fetch tasks. Please try again.")) {
        return;
    }

    tasksContainer.innerHTML = ""; 
    operationsState.textContent = ""; 

    tsks.forEach((task) => {
        renderTask(task);
    });
}

export function renderTask(task) {
    if (!checkResponseStatus(task, "Failed to render task. Please try again.")) {
        return;
    }
    const taskElement = createTaskElement(task)
    tasksContainer.appendChild(taskElement)
}