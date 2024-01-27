// Data structure to hold tasks for each day
let tasksByDay = {
    'Sun': [], 'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 'Fri': [], 'Sat': []
};

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    setActiveDay();
    setupTaskEventListeners();
    setupClearCompletedTasksButton();
    renderTasksForDay('Sun'); // Default to Sunday
});

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasksByDay');
    if (savedTasks) {
        tasksByDay = JSON.parse(savedTasks);
    }
}

function setActiveDay() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const currentDay = daysOfWeek[currentDate.getDay()];

    const activeButton = document.getElementById(`btn-${currentDay}`);
    if (activeButton) {
        activeButton.classList.add('active');
        renderTasksForDay(currentDay);
    }
}

function setupTaskEventListeners() {
    ['priority', 'other', 'event'].forEach(category => {
        setupEventListenerForTaskCategory(category);
    });
}

function setupEventListenerForTaskCategory(category) {
    const addButtonId = `add-${category}-task-btn`;
    const addBtn = document.getElementById(addButtonId);
    const inputId = `${category}-task-input`;
    const inputField = document.getElementById(inputId);

    if (addBtn && inputField) {
        addBtn.addEventListener('click', () => {
            const taskContent = inputField.value;
            if (!taskContent.trim()) {
                alert('Please enter a task.');
                return;
            }
            addTask(taskContent, category);
            inputField.value = '';
            renderTasksForDay(document.querySelector('.weekdays button.active').textContent);
        });

        inputField.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const taskContent = inputField.value;
                if (!taskContent.trim()) {
                    alert('Please enter a task.');
                    return;
                }
                addTask(taskContent, category);
                inputField.value = '';
                renderTasksForDay(document.querySelector('.weekdays button.active').textContent);
            }
        });
    }
}

function addTask(taskContent, category) {
    const selectedDay = document.querySelector('.weekdays button.active').textContent;
    const newTask = { content: taskContent, category: category, completed: false };
    tasksByDay[selectedDay].push(newTask);
    renderTasksForDay(selectedDay);
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay));
}

function renderTasksForDay(day) {
    const priorityTasksList = document.getElementById('priority-tasks');
    priorityTasksList.innerHTML = '';
    tasksByDay[day].forEach(task => {
        if (task.category === 'priority') {
            const taskItem = createTaskItem(task.content, task.category, task.completed);
            priorityTasksList.appendChild(taskItem);
        }
    });
}

function createTaskItem(taskContent, categoryId, completed) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-category', categoryId);

    const taskContentSpan = document.createElement('span');
    taskContentSpan.className = 'task-content' + (completed ? ' completed' : '');
    taskContentSpan.textContent = taskContent;
    taskItem.appendChild(taskContentSpan);

    if (completed) {
        const returnButton = createButton('Return Task', 'return-btn', () => returnTask(taskItem));
        taskItem.appendChild(returnButton);
    } else {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'task-buttons';
        const completeButton = createButton('Complete', 'complete-btn', () => toggleComplete(taskItem));
        buttonsContainer.appendChild(completeButton);
        const deleteButton = createButton('Delete', 'delete-btn', () => deleteTask(taskItem));
        buttonsContainer.appendChild(deleteButton);
        taskItem.appendChild(buttonsContainer);
    }

    return taskItem;
}

function toggleComplete(taskItem) {
    const selectedDay = document.querySelector('.weekdays button.active').textContent;
    const taskContent = taskItem.querySelector('.task-content').textContent;

    tasksByDay[selectedDay] = tasksByDay[selectedDay].map(task => {
        if (task.content === taskContent) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    renderTasksForDay(selectedDay);
}

function returnTask(taskItem) {
    const selectedDay = document.querySelector('.weekdays button.active').textContent;
    const taskContent = taskItem.querySelector('.task-content').textContent;

    tasksByDay[selectedDay] = tasksByDay[selectedDay].map(task => {
        if (task.content === taskContent) {
            return { ...task, completed: false };
        }
        return task;
    });

    renderTasksForDay(selectedDay);
}

function deleteTask(taskItem) {
    const selectedDay = document.querySelector('.weekdays button.active').textContent;
    const taskContent = taskItem.querySelector('.task-content').textContent;

    tasksByDay[selectedDay] = tasksByDay[selectedDay].filter(task => task.content !== taskContent);

    renderTasksForDay(selectedDay);
}

function createButton(text, className, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', clickHandler);
    return button;
}

function setupClearCompletedTasksButton() {
    const clearCompletedBtn = document.getElementById('clear-completed-tasks-btn');
    clearCompletedBtn.addEventListener('click', () => {
        const confirmed = confirm("Are you sure you want to delete all your completed tasks? You cannot undo this.");
        if (confirmed) {
            // Loop through each day and filter out the completed tasks
            for (const day in tasksByDay) {
                tasksByDay[day] = tasksByDay[day].filter(task => !task.completed);
            }
            renderTasksForDay(document.querySelector('.weekdays button.active').textContent);
        }
    });
}


function renderTasksForDay(day) {
    const priorityTasksList = document.getElementById('priority-tasks');
    const otherTasksList = document.getElementById('other-tasks');
    const eventsList = document.getElementById('events');

    priorityTasksList.innerHTML = '';
    otherTasksList.innerHTML = '';
    eventsList.innerHTML = '';

    tasksByDay[day].forEach(task => {
        const taskItem = createTaskItem(task.content, task.category, task.completed);
        switch (task.category) {
            case 'priority':
                priorityTasksList.appendChild(taskItem);
                break;
            case 'other':
                otherTasksList.appendChild(taskItem);
                break;
            case 'event':
                eventsList.appendChild(taskItem);
                break;
        }
    });

    // Render completed tasks (universal)
    renderCompletedTasks();
}

// New function to render completed tasks universally
function renderCompletedTasks() {
    const completedTasksList = document.getElementById('completed-list');
    completedTasksList.innerHTML = '';

    for (const day in tasksByDay) {
        tasksByDay[day].forEach(task => {
            if (task.completed) {
                const completedTaskItem = createTaskItem(task.content, task.category, task.completed);
                completedTasksList.appendChild(completedTaskItem);
            }
        });
    }
}