import {addTaskService, modifyTaskService, removeTaskService } from "../services/taskService.js"
import { renderTask, renderResponseStatus } from "../ui/render.js";
import { prepareTaskElementToModify, modifyTaskElement, removeTaskElement, cancelModifyingElement } from "../ui/elements.js";
import { createElementObject } from "../utils/helpers.js"
import { taskAddInput, taskAddBtn, allTasksBtn, completedTasksBtn, InProgressTasksBtn, operationsState, tasksContainer } from "../dom.js"
import { filterTasks } from "../ui/filters.js"
import { state } from "../state/state.js";

export function registerListeners() {
    taskAddBtn.addEventListener("click", async () => {
        if(await addTaskService(taskAddInput.value))
            taskAddInput.value = "";
    })

    taskAddInput.addEventListener("keydown", async (event) => {
        if (taskAddInput.value.length >= 30 && event.key !== "Backspace") {
            event.preventDefault(); 
        }
        if (event.key === "Enter" && taskAddInput.value.length <= 25) {
            if(await addTaskService(taskAddInput.value))
                taskAddInput.value = "";
        }
    })

    tasksContainer.addEventListener("click", async (e) => {
        const elementObject = createElementObject(e.target.parentElement);
        if(e.target.classList.contains("taskModifyBtn")){
            prepareTaskElementToModify(elementObject)
        }
        else if(e.target.classList.contains("taskSaveBtn")) {
            if(!await modifyTaskService(createElementObject(e.target.parentElement))) {
                cancelModifyingElement(elementObject)
            }
        }
        else if(e.target.classList.contains("taskDeleteBtn")) {
            await removeTaskService(elementObject)
        }
    })

    tasksContainer.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && e.target.classList.contains("taskInput")) {
            if(!await modifyTaskService(createElementObject(e.target.parentElement))) {
                cancelModifyingElement(createElementObject(e.target.parentElement))
            }
        }
    })

    tasksContainer.addEventListener("change", async (e) => {
        const elementObject = createElementObject(e.target.parentElement)
        if(e.target.classList.contains("taskCheckbox"))
            if(!await modifyTaskService(elementObject)) {
                e.target.checked = !e.target.checked
            }
    })

    allTasksBtn.addEventListener('click', () => state.setFilter('all'));
    completedTasksBtn.addEventListener('click', () => state.setFilter('completed'));
    InProgressTasksBtn.addEventListener('click', () => state.setFilter('in-progress'));
}