const API_URL = "https://localhost:7131/api/Tasks";

async function parseJsonIfAny(response) {
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

async function handleFetch(url, options = {}) {
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

export async function getTasks(searchTerm = "", signal) {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    return (await handleFetch(`${API_URL}${query}`, { signal })) ?? [];
}

export async function getTask(taskId, signal) {
    return await handleFetch(`${API_URL}/${taskId}`, { signal });
}

export async function postTask(newTaskObject, signal) {
    return await handleFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskObject),
        signal
    });
}

export async function putTask(taskId, updatedTaskObject, signal) {
    return await handleFetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskObject),
        signal
    });
}

export async function deleteTask(taskId, signal) {
    return await handleFetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        signal
    });
}