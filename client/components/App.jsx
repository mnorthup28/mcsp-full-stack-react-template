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

  const handleClick = (task) => {
    fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    })
      .then((res) => {
        console.log("Updating...", task);
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((updatedTask) => {
        console.log("Updated task:", updatedTask);
      })
      .catch((err) => {
        console.error(err);
      });
    location.reload();
  };

  const handleDoubleClick = (task) => {
    // Delete the original task
    fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log("Deleting...", task);
        if (!res.ok) {
          throw new Error("Something went wrong");
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
          className={`tasks ${task.completed ? "completed-task" : ""}`}
          key={task.id}
          onDoubleClick={() => handleDoubleClick(task)}
          onClick={() => handleClick(task)}
        >
          {task.completed ? (
            <span className="completed-task-text">
              {task.task}
              <br />
              <br />
              Completed! Good work!
            </span>
          ) : (
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
