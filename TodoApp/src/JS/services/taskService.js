import {getTasks, getTask, postTask, putTask, deleteTask } from "../api/tasksAPI.js"
import { state } from "../state/state.js"

export async function addTaskService(taskTitle) {
    const title = taskTitle.trim()
        if (!title) {
            alert("Enter a task title")
            return null
        }

    const newTask = {
        title,
        isCompleted: false,
    }

    const task = await postTask(newTask)
    if (task)
        state.tasks.push(task)
    return task
}

export async function modifyTaskService(taskElementObject) {
    const txt = taskElementObject.input.value.trim()
    if(!txt) {
        alert("Enter a task title!")
        return null
    }

    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)
    state.tasks[index].title = txt
    const { id, createdDate, updatedDate, ...safeTask } = state.tasks[index]

    const task = await putTask(taskId, safeTask)
    if (!task)
        state.tasks[index].title = taskElementObject.title.textContent
    return task
}

export async function removeTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)

    const task = await deleteTask(taskId)
    if (task)
        state.tasks.splice(index, 1)
    return task
}

export async function setTaskStatusService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)
    state.tasks[index].isCompleted = taskElementObject.checkbox.checked

    const { id, createdDate, updatedDate, ...safeTask } = state.tasks[index]
    const task = await putTask(taskId, safeTask)
    if(!task) {
        state.tasks[index].isCompleted = !taskElementObject.checkbox.checked
    }
    else {
        alert("Failed to update task status. Please try again.")
    }
    return task
}