class CreateTask {
    constructor(personas, prioridades, estados) {
        this.personas = personas;
        this.prioridades = prioridades;
        this.estados = estados;
        this.editing = false;
        this.task = null;
    }

    generateOptions(options) {
        return options.map(option => `<option>${option}</option>`).join('');
    }

    toHTML() {
        return `
            <div class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title has-text-weight-semibold">Creación de tarea</p>
                        <button class="delete" aria-label="close" id="cancelButton"></button>
                    </header>
                    <section class="modal-card-body">
                        <form>
                            <div class="field">
                                <label class="label">Título</label>
                                <div class="control">
                                    <input class="input"  type="text" placeholder="Título de la tarea" id="taskTitle">
                                </div>
                                <p id="titleError" class="help is-danger" style="display: none;">Debe ingresar un título.</p>
                            </div>
                            <div class="field">
                                <label class="label">Descripción</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="Descripción de la tarea" id="taskDesc"></textarea>
                                </div>
                                <p id="descriptionError" class="help is-danger" style="display: none;">Debe ingresar una descripción. </p>
                            </div>

                            <div class="field">
                                <label class="label">Asignado</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskAssigned">
                                            ${this.generateOptions(this.personas)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Prioridad</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskPriority">
                                            ${this.generateOptions(this.prioridades)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Estado</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskStatus">
                                            ${this.generateOptions(this.estados)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Fecha límite</label>
                                <div class="control">
                                    <input class="input" type="date" id="taskDueDate">
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer class="modal-card-foot">
                        <div class="control" id="saveButton">
                                <button class="button is-primary" disabled>Crear tarea</button>
                        </div>
                        <div class="control" id="deleteButton">
                            <button class="button is-danger" style="display: none;">Eliminar tarea</button>
                        </div>
                    </footer>
                </div>
            </div>
        `;
    }
    
    openModal() {
        document.querySelector('.modal-card-title').textContent = 'Creación de tarea';
        document.querySelector('#saveButton button').textContent = 'Crear tarea';
        document.querySelector('#modal-container .modal').classList.add('is-active');
        document.querySelector('#deleteButton button').style.display = 'none';
    }

    validateTask() {
        const title = document.querySelector('#taskTitle').value.trim();
        const description = document.querySelector('#taskDesc').value.trim();
        
        let isValid = true;
        
        if (title === '') {
            document.getElementById('titleError').style.display = 'block';
            document.querySelector('#taskTitle').classList.add('is-danger');
            isValid = false;
        } else {
            document.getElementById('titleError').style.display = 'none';
            document.querySelector('#taskTitle').classList.remove('is-danger');
        }
        
        if (description === '') {
            document.getElementById('descriptionError').style.display = 'block';
            document.querySelector('#taskDesc').classList.add('is-danger');
            isValid = false;
        } else {
            document.getElementById('descriptionError').style.display = 'none';
            document.querySelector('#taskDesc').classList.remove('is-danger');
        }
        
        document.querySelector('#saveButton button').disabled = !isValid;
        return isValid;
    }

    async deleteTask() {
        try {
            const response = await fetch("http://localhost:3000/api/tasks/" + this.task.id, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error('Error al eliminar la tarea');
                return null;
            }
            document.getElementById(this.task.id).remove();

            // Actualizar el array de tareas
            tasks = tasks.filter(t => t.id !== this.task.id);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    loadTask(task) {
        const currentTask = tasks.find(t => t.id === task.id);
        this.editing = true;
        this.task = task;
        
        document.querySelector('#taskTitle').value = currentTask.title;
        document.querySelector('#taskDesc').value = currentTask.description;
        document.querySelector('#taskAssigned').value = currentTask.assignedTo;
        document.querySelector('#taskPriority').value = currentTask.priority;
        document.querySelector('#taskStatus').value = currentTask.status;
        document.querySelector('#taskDueDate').value = currentTask.dueDate;
        document.querySelector('#deleteButton button').style.display = 'block';
        document.querySelector('.modal-card-title').textContent = 'Editar tarea';
        document.querySelector('#saveButton button').textContent = 'Guardar cambios';
        document.querySelector('#saveButton button').disabled = false;
        document.querySelector('#modal-container .modal').classList.add('is-active');
    }

    async saveTask() {
        if (!this.validateTask()) return;
    
        if (this.editing) {
            // Elimina el elemento del DOM y actualiza el array de tareas
            document.getElementById(this.task.id).remove();
            tasks = tasks.filter(t => t.id !== this.task.id); // Filtra la tarea vieja fuera del array
            this.editing = false;
        }
    
        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDesc').value;
        const assigned = document.querySelector('#taskAssigned').value;
        const priority = document.querySelector('#taskPriority').value;
        const status = document.querySelector('#taskStatus').value;
        let dueDate = document.querySelector('#taskDueDate').value;
    
        if (!dueDate) {
            const today = new Date();
            today.setDate(today.getDate() + 7);
            dueDate = today.toISOString().slice(0, 10);
        }
    
        const taskData = {
            title,
            description,
            assigned,
            priority,
            status,
            dueDate
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
    
            if (!response.ok) {
                throw new Error('Error al crear la tarea.');
            }
    
            const createdTask = await response.json();
    
            tasks.push(createdTask);
    
            this.renderTask(createdTask);
    
            this.cancelTask();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    renderTask(task) {
        let container;
        const taskObj = new Task(task.title, task.description, task.assigned, task.priority, task.status, new Date(), task.dueDate, task.id);
    
        switch (taskObj.status) {
            case 'backlog':
                container = document.getElementById('backlog');
                break;
            case 'toDo':
                container = document.getElementById('toDo');
                break;
            case 'inProgress':
                container = document.getElementById('inProgress');
                break;
            case 'blocked':
                container = document.getElementById('blocked');
                break;
            case 'done':
                container = document.getElementById('done');
                break;
            default:
                return;
        }
    
        container.innerHTML += taskObj.toHTML(); 
    }
    cancelTask() {
        document.querySelector('#taskTitle').value = '';
        document.querySelector('#taskDesc').value = '';
        document.querySelector('#taskAssigned').selectedIndex = 0;
        document.querySelector('#taskPriority').selectedIndex = 0;
        document.querySelector('#taskStatus').selectedIndex = 0;
        document.querySelector('#taskDueDate').value = '';
        document.getElementById('titleError').style.display = 'none';
        document.getElementById('descriptionError').style.display = 'none';
        document.querySelector('#taskTitle').classList.remove('is-danger');
        document.querySelector('#taskDesc').classList.remove('is-danger');
        document.querySelector('#saveButton button').disabled = true;
    }
}