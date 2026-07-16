import {addTaskService, modifyTaskService, removeTaskService, setTaskStatusService } from "../services/taskService.js"
import { renderTask } from "../ui/render.js";
import { prepareTaskElementToModify, modifyTaskElement, removeTaskElement } from "../ui/elements.js";
import { createElementObject } from "../utils/helpers.js"
import { taskAddInput, taskAddBtn, allTasksBtn, completedTasksBtn, InProgressTasksBtn } from "../dom.js"
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
            await modifyTaskService(createElementObject(e.target.parentElement))
            
            modifyTaskElement(createElementObject(e.target.parentElement))
        }
        else if(e.target.classList.contains("taskDeleteBtn")) {
            await removeTaskService(createElementObject(e.target.parentElement))
            removeTaskElement(e.target.parentElement)
        }
    })

    tasksContainer.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            if(e.target.classList.contains("taskInput"))
                await modifyTaskService(createElementObject(e.target.parentElement))
                modifyTaskElement(createElementObject(e.target.parentElement))
        }
    })

    tasksContainer.addEventListener("change", (e) => {
        if(e.target.classList.contains("taskCheckbox"))
            setTaskStatusService(createElementObject(e.target.parentElement))
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