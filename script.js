document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const appContainer = document.querySelector(".app-container");
    const tasksCompleted = {}; // Object to track completed days

    // Define your tasks (replace with dynamic JSON fetching if needed)
    const tasks = [
        "Make your bed",
        "Brush your teeth",
        "Read for 15 minutes",
        "Help with chores"
    ];

    // Display tasks in the task list
    function displayTasks() {
        taskList.innerHTML = ""; // Clear the current tasks
        tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = task;
            listItem.className = "task-item";
            listItem.dataset.index = index;

            // Restore completed state from localStorage
            const today = new Date().toISOString().split("T")[0];
            const savedData = JSON.parse(localStorage.getItem(today)) || {};
            if (savedData[index]) {
                listItem.classList.add("completed");
            }

            listItem.addEventListener("click", () => toggleTask(listItem));
            taskList.appendChild(listItem);
        });
    }

    // Toggle task completion
    function toggleTask(listItem) {
        listItem.classList.toggle("completed");
        saveTaskCompletion();
        checkAllTasksCompleted();
    }

    // Check if all tasks are completed
    function checkAllTasksCompleted() {
        const allTasks = document.querySelectorAll(".task-item");
        const allCompleted = Array.from(allTasks).every(task => task.classList.contains("completed"));
        if (allCompleted) {
            showWellDoneScreen();
            saveDayCompletion();
        }
    }

    // Show "Well Done" screen
    function showWellDoneScreen() {
        appContainer.innerHTML = `
            <div class="well-done">
                <h1>Well Done!</h1>
                <p>You completed all your tasks for today!</p>
            </div>
        `;
    }

    // Save task completion status for the day
    function saveTaskCompletion() {
        const today = new Date().toISOString().split("T")[0];
        const completedTasks = {};
        const taskItems = document.querySelectorAll(".task-item");
        taskItems.forEach((task, index) => {
            completedTasks[index] = task.classList.contains("completed");
        });
        localStorage.setItem(today, JSON.stringify(completedTasks));
    }

    // Save day completion to track progress
    function saveDayCompletion() {
        const today = new Date().toISOString().split("T")[0];
        tasksCompleted[today] = true;
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    }

    // Initial load
    displayTasks();
});
