import {addTaskService, modifyTaskService, removeTaskService, setTaskStatusService } from "../services/taskService.js"
import { renderTask } from "../ui/render.js";
import { prepareTaskElementToModify, modifyTaskElement, removeTaskElement } from "../ui/elements.js";
import { createElementObject } from "../utils/helpers.js"
import { taskAddInput, taskAddBtn, allTasksBtn, completedTasksBtn, InProgressTasksBtn, operationsState, tasksContainer } from "../dom.js"
import { filterTasks } from "../ui/filters.js"

export function registerListeners() {
    taskAddBtn.addEventListener("click", async () => {
        await handleAddTask()
    })

    taskAddInput.addEventListener("keydown", async (event) => {
        if (taskAddInput.value.length >= 25 && event.key !== "Backspace") {
            event.preventDefault(); 
        }
        if (event.key === "Enter" && taskAddInput.value.length <= 25) {
            await handleAddTask()
        }
    })

    tasksContainer.addEventListener("click", async (e) => {
        if(e.target.classList.contains("taskModifyBtn")){
            prepareTaskElementToModify(createElementObject(e.target.parentElement))
        }
        else if(e.target.classList.contains("taskSaveBtn")) {
            const modifiedTask = await modifyTaskService(createElementObject(e.target.parentElement))
            if (!modifiedTask) {
                modifyTaskElement(null)
                return
            }
            modifyTaskElement(createElementObject(e.target.parentElement))
        }
        else if(e.target.classList.contains("taskDeleteBtn")) {
            const removedTask = await removeTaskService(createElementObject(e.target.parentElement))
            if (!removedTask) {
                removeTaskElement(null)
                return
            }
            removeTaskElement(e.target.parentElement)
        }
    })

    tasksContainer.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && e.target.classList.contains("taskInput")) {
            const modifiedTask = await modifyTaskService(createElementObject(e.target.parentElement))
            if (!modifiedTask) {
                modifyTaskElement(null)
                return
            }
            modifyTaskElement(createElementObject(e.target.parentElement))
        }
    })

    tasksContainer.addEventListener("change", async (e) => {
        if(e.target.classList.contains("taskCheckbox"))
            if(!await setTaskStatusService(createElementObject(e.target.parentElement)))
                e.target.checked = !e.target.checked
    })

    allTasksBtn.addEventListener('click', () => filterTasks('all'));
    completedTasksBtn.addEventListener('click', () => filterTasks('completed'));
    InProgressTasksBtn.addEventListener('click', () => filterTasks('in-progress'));
}

async function handleAddTask() {
    const task = await addTaskService(taskAddInput.value);
    renderTask(task);
    taskAddInput.value = "";
}