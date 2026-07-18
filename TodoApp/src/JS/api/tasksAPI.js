const API_URL = "https://localhost:7131/api/Tasks";

async function parseJsonIfAny(response) {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    return JSON.parse(text);
}

export async function getTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await parseJsonIfAny(response);
        return data ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await parseJsonIfAny(response);
    } catch (error) {
        console.log(error);
        return null;
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await parseJsonIfAny(response);
    } catch (error) {
        console.log(error);
        return null;
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function deleteTask(taskId){
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}