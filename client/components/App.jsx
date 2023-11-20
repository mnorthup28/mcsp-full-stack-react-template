import React, { useEffect, useState } from "react";
import Note from "./Note.jsx";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setTasks(tasks);
        console.log("Fetched Tasks: ", tasks);
      });
  }, []);

  const submitTask = (taskData) => {
    fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        console.log("Submitted Task: ", taskData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNoteSubmit = (noteData) => {
    const taskObject = noteData;
    const taskData = {
      task: taskObject.task,
      due: taskObject.dueDate,
      completed: noteData.completed,
    };
    submitTask(taskData);
  };

  return (
    <Note className="submit" onSubmit={handleNoteSubmit}>
      {tasks.map((task) => (
        <span className="tasks" key={task.id}>
          {task.content}
        </span>
      ))}
    </Note>
  );
};

export default App;
