function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
}

function onDragOver(event) {
  event.preventDefault();
}

async function onDrop(event) {
  const id = event.dataTransfer.getData('text');

  const draggableElement = document.getElementById(id);

  const dropzone = event.target;

  if (dropzone.classList.contains('taskColumn')) {
    dropzone.appendChild(draggableElement);

    tasks.forEach(task => {
      if (task.id === id) {
        task.status = dropzone.id;
        document.getElementById(task.id).innerHTML = new Task(task.title, task.description, task.assignedTo, task.priority, task.status, task.createdAt, task.dueDate, task.id).toHTML();
      }
    });

    event
      .dataTransfer
      .clearData();
  }
}

