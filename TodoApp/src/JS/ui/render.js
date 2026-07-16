import { tasksContainer } from "../dom.js";
import { state } from "../state/state.js";
import { createTaskElement } from "./elements.js";

export function renderAllTasks() {
    state.tasks.forEach((task) => {
        renderTask(task)
    })
}

export function renderTask(task) {
    const taskElement = createTaskElement(task)
    tasksContainer.appendChild(taskElement)
}