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

  const handleDoubleClick = (task) => {
    // console.log("double clicked  ", task.completed);
    // const index = tasks.findIndex((t) => t.id === task.id);
    // const newTasks = [...tasks];
    // newTasks[index].completed = true;
    // setTasks(newTasks);
    fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log("deleting...", task);
        if (!res.ok) {
          throw new Error("something went wrong");
        }
      })
      .catch((err) => {
        console.error(err);
      });
    location.reload();
  };

  return (
    <>
      <br />
      <Note className="submit" onSubmit={handleNoteSubmit} />
      {tasks.map((task) => (
        <div
          className="tasks"
          key={task.id}
          onDoubleClick={() => handleDoubleClick(task)}
        >
          {task.completed ? null : (
            <span>
              {task.task}
              <br />
              <br />
              Complete by: {task.due}
            </span>
          )}
          <br />
        </div>
      ))}
    </>
  );
};

export default App;
