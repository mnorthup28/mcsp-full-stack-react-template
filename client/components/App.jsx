import React, { useEffect, useState } from "react";
import Note from "./Note.jsx";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

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
    // make an object of the parts of of the task object.
    // put it on a different post it, but red.
    // instead of due date say "FINISHED"
    // will need fetch requests to get from another table AND read from that table
    fetch("/api/deletedTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((newDeletedTask) => {
        // Update state with the new deleted task
        setDeletedTasks([...deletedTasks, newDeletedTask]);

        // Fetch the details of the newly created deleted task
        fetch(`/api/deletedTasks/${newDeletedTask.id}`)
          .then((res) => res.json())
          .then((fetchedDeletedTask) => {
            // Update state with the fetched deleted task
            setDeletedTasks([...deletedTasks, fetchedDeletedTask]);
            console.log("Fetched Deleted Task: ", fetchedDeletedTask);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });

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
    // location.reload();
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
      <br />
      {deletedTasks.map((deletedTask) => (
        <div className="deletedTasks" key={deletedTasks.id}>
          <span>{deletedTask.deletedTask}</span>
        </div>
      ))}
    </>
  );
};

export default App;
