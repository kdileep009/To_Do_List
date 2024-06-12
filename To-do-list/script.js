document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');

taskForm.addEventListener('submit', addTask);

function addTask(event) {
    event.preventDefault();
    const taskText = newTaskInput.value.trim();
    if (taskText !== '') {
        const task = createTaskElement(taskText);
        taskList.appendChild(task);
        storeTaskInLocalStorage(taskText);
        newTaskInput.value = '';
    }
}

function createTaskElement(taskText) {
    const tr = document.createElement('tr');
    tr.className = 'incomplete';

    const taskContent = document.createElement('td');
    taskContent.className = 'task-content';
    taskContent.textContent = taskText;

    const taskButtons = document.createElement('td');
    taskButtons.className = 'task-buttons';

    const completeButton = document.createElement('button');
    completeButton.className = 'complete';
    completeButton.innerHTML = '✔';
    completeButton.addEventListener('click', completeTask);

    const wrongButton = document.createElement('button');
    wrongButton.className = 'wrong';
    wrongButton.innerHTML = '✖';
    wrongButton.addEventListener('click', incompleteTask);

    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.innerHTML = '✎';
    editButton.addEventListener('click', editTask);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerHTML = '🗑';
    deleteButton.addEventListener('click', deleteTask);

    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(wrongButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    const statusTd = document.createElement('td');
    statusTd.className = 'status';
    statusTd.textContent = 'Incomplete';

    tr.appendChild(taskContent);
    tr.appendChild(taskButtons);
    tr.appendChild(statusTd);

    return tr;
}

function completeTask(event) {
    const tr = event.target.parentElement.parentElement;
    const statusTd = tr.querySelector('.status');
    tr.classList.add('completed');
    tr.classList.remove('incomplete');
    statusTd.textContent = 'Completed';
    updateTaskInLocalStorage(tr.querySelector('.task-content').textContent, true);
}

function incompleteTask(event) {
    const tr = event.target.parentElement.parentElement;
    const statusTd = tr.querySelector('.status');
    tr.classList.add('incomplete');
    tr.classList.remove('completed');
    statusTd.textContent = 'Incomplete';
    updateTaskInLocalStorage(tr.querySelector('.task-content').textContent, false);
}

function editTask(event) {
    const tr = event.target.parentElement.parentElement;
    const taskText = tr.querySelector('.task-content').textContent;
    const newTaskText = prompt('Edit your task', taskText);
    if (newTaskText !== null && newTaskText.trim() !== '') {
        tr.querySelector('.task-content').textContent = newTaskText;
        editTaskInLocalStorage(taskText, newTaskText);
    }
}

function deleteTask(event) {
    const tr = event.target.parentElement.parentElement;
    taskList.removeChild(tr);
    removeTaskFromLocalStorage(tr.querySelector('.task-content').textContent);
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text);
        if (task.completed) {
            taskElement.classList.add('completed');
            taskElement.classList.remove('incomplete');
            taskElement.querySelector('.status').textContent = 'Completed';
        }
        taskList.appendChild(taskElement);
    });
}

function storeTaskInLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskText, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(t => t.text === taskText);
    task.completed = completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTaskInLocalStorage(oldText, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(t => t.text === oldText);
    task.text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const updatedTasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
