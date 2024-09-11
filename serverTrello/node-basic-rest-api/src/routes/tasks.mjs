import express from "express";
const router = express.Router();

// Sample data (tasks)
let tasks = [
  {
    title: "Task 1",
    description: "Description for Task 1",
    assignedTo: "Rodrigo Lujambio",
    priority: "Low",
    status: "toDo",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    id:"1",
  },
  {
    title: "Task 2",
    description: "Description for Task 2",
    assignedTo: "Michel Sampil",
    priority: "Medium",
    status: "inProgress",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    id: "2",
  },
  {
    title: "Task 3",
    description: "Description for Task 3",
    assignedTo: "Jose Abadie",
    priority: "High",
    status: "done",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    id: "3",
  },
];

// GET all tasks
router.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST a new task
router.post("/tasks", (req, res) => {
  const task = req.body;
  task.id = (tasks.length + 1).toString();
  tasks.push(task);
  res.status(201).json(task);
});

// DELETE a task by ID
router.delete("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  tasks = tasks.filter((task) => task.id !== taskId);
  res.sendStatus(204);
});

// PUT (update) a task by ID
router.put("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = req.body;

  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, ...updatedTask, id: taskId };
    }
    return task;
  });

  res.json(tasks.find((task) => task.id === taskId));
});

export default router;
