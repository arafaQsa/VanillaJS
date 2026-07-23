export function createElementObject(taskElement) {
    const taskElementObject = {
        id: Number(taskElement.dataset.id),
        element: taskElement,
        checkbox: taskElement.querySelector(".taskCheckbox"),
        title: taskElement.querySelector(".taskTitle"),
        input: taskElement.querySelector(".taskInput"),
        modifyBtn: taskElement.querySelector(".taskModifyBtn"),
        saveBtn: taskElement.querySelector(".taskSaveBtn"),
        deleteBtn: taskElement.querySelector(".taskDeleteBtn")
    }
    return taskElementObject
}