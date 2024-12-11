document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const streakContainer = document.querySelector(".streak-container");
    const appContainer = document.querySelector(".app-container");
    const tasksCompleted = {}; // Object to track completed days

    // Example tasks (replace this with dynamic tasks from JSON if needed)
    const tasks = [
        "Task 1",
        "Task 2",
        "Task 3",
        "Task 4"
    ];

    // Display tasks in the task list
    function displayTasks() {
        taskList.innerHTML = ""; // Clear the current tasks
        tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = task;
            listItem.className = "task-item";
            listItem.dataset.index = index;
            listItem.addEventListener("click", () => toggleTask(listItem));
            taskList.appendChild(listItem);
        });
    }

    // Toggle task completion
    function toggleTask(listItem) {
        listItem.classList.toggle("completed");
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

    // Save day completion to localStorage
    function saveDayCompletion() {
        const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
        tasksCompleted[today] = true;
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    }

    // Load completed days from localStorage
    function loadCompletedDays() {
        const savedData = localStorage.getItem("tasksCompleted");
        if (savedData) {
            Object.assign(tasksCompleted, JSON.parse(savedData));
        }
    }

    // Initial load
    loadCompletedDays();
    displayTasks();
});
