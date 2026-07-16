const API_URL = "https://localhost:7131/api/Tasks";

export async function getTasks() {
    try {
        const response = await fetch(API_URL)
        return await response.json()
    } catch (error) {
        console.log("Error occurred while fetching tasks: ", error)
        return []
    }
}

export async function getTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`)
        return await response.json()
    } catch (error) {
        console.log("Error occurred while fetching the task: ", error)
    }
}

export async function postTask(newTaskObject){
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTaskObject)
        });

        const result = await response.json();
        console.log("تمت الإضافة بنجاح:", result);
        return result;
    } catch (error) {
        console.error("خطأ في الإضافة:", error);
    }
}

export async function putTask(taskId, updatedTask){
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        const result = await response.json();
        console.log("تم التحديث بنجاح:", result);
        return result
    } catch (error) {
        console.error("خطأ في التحديث:", error);
    }
}

export async function deleteTask(taskId){
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });

        const result = await response.json();
        console.log("تم الحذف بنجاح:", result);
    } catch (error) {
        console.error("خطأ في الحذف:", error);
    }
}