export function createElement(tagName, properties = {}) {
    return Object.assign(document.createElement(tagName), properties);
}

export function createTaskElement(task) {
    const taskElement = createElement("div", { className: "taskElement" });
    taskElement.dataset.id = task.id;

    taskElement.append(
        createElement("input", { className: "taskCheckbox", type: "checkbox", checked: task.isCompleted }),
        createElement("span", { className: "taskTitle", textContent: task.title }),
        createElement("input", { className: "taskInput hidden", type: "text" }), // تمت إضافة hidden مباشرة
        createElement("button", { className: "taskModifyBtn", textContent: "✍️" }),
        createElement("button", { className: "taskSaveBtn hidden", textContent: "👌" }),
        createElement("button", { className: "taskDeleteBtn", textContent: "🗑️" })
    );

    return taskElement;
}

export function prepareTaskElementToModify(taskElementObject) {
    taskElementObject.deleteBtn.disabled = true
    taskElementObject.input.value = taskElementObject.title.textContent
    taskElementObject.title.classList.add("hidden")
    taskElementObject.input.classList.remove("hidden")
    taskElementObject.modifyBtn.classList.add("hidden")
    taskElementObject.saveBtn.classList.remove("hidden")
    taskElementObject.input.focus()
}

export function modifyTaskElement(taskElementObject) {
    taskElementObject.title.textContent = taskElementObject.input.value
    taskElementObject.input.classList.add("hidden")
    taskElementObject.title.classList.remove("hidden")
    taskElementObject.modifyBtn.classList.remove("hidden")
    taskElementObject.saveBtn.classList.add("hidden")
    taskElementObject.deleteBtn.disabled = false
}

export function removeTaskElement(element) {
    tasksContainer.removeChild(element)
}