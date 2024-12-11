const loadTasksFromJSON = async () => {
try {
const response = await fetch("tasks.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
const data = await response.json();
            console.log("Fetched Data:", data); // Debugging
tasks = data;
loadTasksForToday();
} catch (error) {
@@ -23,6 +25,7 @@ document.addEventListener("DOMContentLoaded", () => {

// Get tasks for the current day
const getTasksForDay = (day) => {
        console.log("Current Day:", day); // Debugging
const dailyTasks = tasks.tasks.daily || [];
const weekdayTasks = tasks.tasks.weekdays.find((group) =>
group.days.includes(day)
@@ -36,7 +39,7 @@ document.addEventListener("DOMContentLoaded", () => {
}
return acc;
}, []);

        console.log("Tasks for Day:", [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks]); // Debugging
return [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
};

@@ -51,6 +54,7 @@ document.addEventListener("DOMContentLoaded", () => {

// Display tasks with checkboxes
const displayTasks = (tasks) => {
        console.log("Displaying Tasks:", tasks); // Debugging
taskList.innerHTML = ""; // Clear existing tasks

tasks.forEach((task, index) => {
