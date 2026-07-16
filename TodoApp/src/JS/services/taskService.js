import {getTasks, getTask, postTask, putTask, deleteTask } from "../api/tasksAPI.js"
import { state } from "../state/state.js"

export async function addTaskService(taskTitle) {
    const title = taskTitle.trim()
        if (!title) {
            alert("Please enter a task title")
            return
        }

    const newTask = {
        title,
        isCompleted: false,
    }
    const task = await postTask(newTask)
    state.tasks.push(task)
    return task
}

export async function modifyTaskService(taskElementObject) {
    const txt = taskElementObject.input.value.trim()
    if(!txt)
        return console.log("Enter a task title!")

    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)
    state.tasks[index].title = txt

    const { id, createdDate, updatedDate, ...safeTask } = state.tasks[index]
    return await putTask(taskId, safeTask)
}

export async function removeTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)
    state.tasks.splice(index, 1)

    await deleteTask(taskId)
}

export function setTaskStatusService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id)
    const index = state.tasks.findIndex((tsk) => tsk.id === taskId)
    state.tasks[index].isCompleted = taskElementObject.checkbox.checked

    const { id, createdDate, updatedDate, ...safeTask } = state.tasks[index]
    putTask(taskId, safeTask)
}