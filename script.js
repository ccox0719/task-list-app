document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.getElementById("date-display");
    const taskList = document.getElementById("task-list");
    const progressBar = document.getElementById("progress-bar");
    const streakCounter = document.getElementById("streak-counter");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let tasks = [];
    let streak = 0;
    let currentDate = new Date();

    const loadTasksFromJSON = async () => {
        try {
            const response = await fetch("tasks.json");
            if (!response.ok) throw new Error("Failed to load tasks");
            const data = await response.json();
            tasks = data;
            loadTasksForDate(currentDate);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const loadProgress = async () => {
        try {
            const response = await fetch("progress.json");
            if (!response.ok) throw new Error("Failed to load progress");
            const data = await response.json();
    
            // Update streak
            streak = data.streak || 0;
            document.getElementById("streak-counter").textContent = streak;
    
            // Parse completedDays as Date objects
            const completedDates = (data.completedDays || []).map(day => new Date(day));
            const today = new Date();
    
            // Debugging: Show all completed dates and today
            console.log("Completed Dates:", completedDates);
            console.log("Today's Date:", today.toDateString());
    
            // Calculate totals for the last 7 and 30 days
            const daysCompletedLast7Days = completedDates.filter(date => {
                const diffInMs = today - date; // Difference in milliseconds
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
                console.log("Date:", date.toDateString(), "Difference in days:", diffInDays); // Debugging
                return diffInDays >= 0 && diffInDays <= 7; // Within last 7 days
            }).length;
    
            const daysCompletedLast30Days = completedDates.filter(date => {
                const diffInMs = today - date; // Difference in milliseconds
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
                console.log("Date:", date.toDateString(), "Difference in days:", diffInDays); // Debugging
                return diffInDays >= 0 && diffInDays <= 30; // Within last 30 days
            }).length;
    
            // Debugging: Log the totals
            console.log("Days Completed in Last 7 Days:", daysCompletedLast7Days);
            console.log("Days Completed in Last 30 Days:", daysCompletedLast30Days);
    
            // Update the DOM with totals
            document.getElementById("completed-7-days").textContent = daysCompletedLast7Days;
            document.getElementById("completed-30-days").textContent = daysCompletedLast30Days;
    
            // Populate completed days list
            const completedDaysList = document.getElementById("completed-days");
            completedDaysList.innerHTML = ""; // Clear list
            completedDates.forEach(date => {
                const listItem = document.createElement("li");
                listItem.textContent = date.toDateString(); // Format as readable date
                completedDaysList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error loading progress:", error);
            document.getElementById("streak-counter").textContent = "Error";
            document.getElementById("completed-7-days").textContent = "Error";
            document.getElementById("completed-30-days").textContent = "Error";
        }
    };
    
      

    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = document.querySelectorAll(".completed").length;

        if (completedTasks === totalTasks && totalTasks > 0) {
            streak++;
            streakCounter.textContent = streak;

            const today = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
            saveProgress([today]);

            // Show a notification
            showCompletionNotification(streak, today);
        }
    };

    const toggleTask = (checkbox, listItem) => {
        if (checkbox.checked) {
            listItem.classList.add("completed");
        } else {
            listItem.classList.remove("completed");
        }
        updateProgress();
    };

    const showCompletionNotification = (streak, completedDay) => {
        // Create a modal element
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.backgroundColor = "#fff";
        modal.style.borderRadius = "10px";
        modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        modal.style.padding = "20px";
        modal.style.textAlign = "center";
        modal.style.zIndex = "1000";

        // Add content to the modal
        modal.innerHTML = `
            <h2>Congratulations!</h2>
            <p>All tasks for ${completedDay} have been completed.</p>
            <p>Your current streak: <strong>${streak} days</strong></p>
            <button id="close-modal" style="margin-top: 10px; padding: 10px 20px; font-size: 16px; background-color: #38efd7; border: none; border-radius: 5px; cursor: pointer; color: #fff;">
                Close
            </button>
        `;

        // Append the modal to the body
        document.body.appendChild(modal);

        // Add functionality to close the modal
        document.getElementById("close-modal").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
    };

    const loadTasksForDate = (date) => {
        dateDisplay.textContent = date.toDateString();
        const currentDay = daysOfWeek[date.getDay()];
    
        // Fetch tasks for the current day
        const todayTasks = tasks.tasks.daily || [];
        taskList.innerHTML = ""; // Clear the task list
    
        todayTasks.forEach((taskObj, index) => {
            const listItem = document.createElement("li");
    
            // Extract the task name (ensure 'task' property exists in your JSON)
            const taskName = taskObj.task || "Unnamed Task";
    
            // Create a checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => toggleTask(checkbox, listItem));
    
            // Append the checkbox and task name
            listItem.textContent = taskName;
            listItem.prepend(checkbox);
            taskList.appendChild(listItem);
        });
    };
    

    loadProgress();
    loadTasksFromJSON();
});
