let taskModal;
let tasks = [];

document.addEventListener('DOMContentLoaded', () => {

    initilizeTasks();

    const personas = ["Persona 1", "Persona 2", "Persona 3", "Persona 4", "Persona 5"];
    const prioridades = ["Alta", "Media", "Baja"];
    const estados = ["backlog", "toDo", "inProgress", "blocked", "done"];

    taskModal = new CreateTask(personas, prioridades, estados);

    document.getElementById('modal-container').innerHTML = taskModal.toHTML();

    document.getElementById("newTask").addEventListener('click', () => {
        taskModal.openModal();
    });
    document.getElementById("newTaskMini").addEventListener('click', () => {
        taskModal.openModal();
    });

    document.getElementById("saveButton").addEventListener('click', () => {
        taskModal.saveTask();
        document.querySelector('#modal-container .modal').classList.remove('is-active');
    });
    document.getElementById("deleteButton").addEventListener('click', () => {
        taskModal.deleteTask();
        document.querySelector('#modal-container .modal').classList.remove('is-active');
    });
    document.getElementById("cancelButton").addEventListener('click', () => {
        taskModal.cancelTask();
        document.querySelector('#modal-container .modal').classList.remove('is-active');
    });
    document.querySelector('#taskTitle').addEventListener('input', () => taskModal.validateTask());
    document.querySelector('#taskDesc').addEventListener('input', () => taskModal.validateTask());
});


function initilizeTasks() {
    fetch('http://localhost:3000/api/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;

            // Elementos del DOM
            let backLog = document.getElementById('backlog');
            let toDo = document.getElementById('toDo');
            let inProgress = document.getElementById('inProgress');
            let blocked = document.getElementById('blocked');
            let done = document.getElementById('done');

            // Renderiza las tareas en función de su estado
            data.forEach(task => {
                const taskObj = new Task(task.title, task.description, task.assignedTo, task.priority, task.status, task.createdAt, task.dueDate, task.id);
                switch (taskObj.status) {
                    case 'backlog':
                        backLog.innerHTML += taskObj.toHTML();
                        break;
                    case 'toDo':
                        toDo.innerHTML += taskObj.toHTML();
                        break;
                    case 'inProgress':
                        inProgress.innerHTML += taskObj.toHTML();
                        break;
                    case 'blocked':
                        blocked.innerHTML += taskObj.toHTML();
                        break;
                    case 'done':
                        done.innerHTML += taskObj.toHTML();
                        break;
                    default:
                        break;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}