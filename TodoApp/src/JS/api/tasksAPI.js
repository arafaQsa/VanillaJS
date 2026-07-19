const API_URL = "https://localhost:7131/api/Tasks";

async function parseJsonIfAny(response) { // return null if no content, otherwise parse JSON
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
}

async function handleFetch(url, options = {}) { // 
    const response = await fetch(url, options);

    if (response.ok) {
        return await parseJsonIfAny(response);
    }

    const errorBody = await parseJsonIfAny(response);

    throw {
        status: response.status,
        title: errorBody?.title || "API Error",
        detail: errorBody?.detail || errorBody?.message || "Something went wrong",
        errors: errorBody?.errors
    };
}

export async function getTasks() {
    try {
        return await handleFetch(API_URL) ?? [];
    } catch (error) {
        throw error; 
    }
}

export async function postTask(newTaskObject) {
    try {
        return await handleFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTaskObject)
        });
    } catch (error) {
        throw error;
    }
}

export async function putTask(taskId, updatedTaskObject) {
    try {
        return await handleFetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTaskObject)
        });
    } catch (error) {
        throw error;
    }
}

export async function deleteTask(taskId) {
    try {
        return await handleFetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });
    } catch (error) {
        throw error;
    }
}