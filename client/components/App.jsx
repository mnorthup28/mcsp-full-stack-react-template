import React, { useEffect, useState } from "react";
import Note from "./Note.jsx";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setTasks(tasks);
        console.log("Fetched Tasks: ", tasks[0]);
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
        console.log("Submitted Task: ", newTask);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNoteSubmit = (noteData, dueDate) => {
    const taskData = { task: noteData, dueDate, completed: false };
    // ********** Right now it is submitting everything as note data
    submitTask(taskData);
  };
  return (
    <Note className="submit" onSubmit={handleNoteSubmit}>
      {tasks.map((task) => (
        <span className="task" key={task.id}>
          {tasks.content}
        </span>
      ))}
    </Note>
  );
};

export default App;
