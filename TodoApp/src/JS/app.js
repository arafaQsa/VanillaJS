import { registerListeners } from "./events/registerListeners.js";
import { renderAllTasks } from "./ui/render.js";
import { getTasksService } from "./services/taskService.js";

await getTasksService()
await renderAllTasks()
registerListeners()