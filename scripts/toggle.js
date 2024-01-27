// toggle.js

document.addEventListener('DOMContentLoaded', () => {
    const dayButtons = document.querySelectorAll('.weekdays button');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => filterTasksByDay(button.textContent, dayButtons));
    });
});

function filterTasksByDay(selectedDay, dayButtons) {
    // Update active day button styling
    updateActiveDayButton(selectedDay, dayButtons);

    // Hide all tasks initially
    const tasks = document.querySelectorAll('#priority-tasks li, #other-tasks li, #events li, #completed-list li');
    tasks.forEach(task => {
        task.style.display = 'none';
    });

    // Show tasks that match the selected tab
    const selectedTasks = document.querySelectorAll(`#${selectedDay.toLowerCase()}-tasks li`);
    selectedTasks.forEach(task => {
        task.style.display = ''; // Show the task
    });

    // Call the render function from main.js to update the task display
    renderTasksForDay(selectedDay);
}

function updateActiveDayButton(selectedDay, dayButtons) {
    dayButtons.forEach(button => {
        if (button.textContent === selectedDay) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
