import React, { useEffect, useState } from "react";
import Note from "./Note.jsx";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setTasks(tasks);
      });
  }, []);

  return (
    <Note>
      {tasks.map((task) => (
        <span className="task" key={task.id}>
          {tasks.task}
        </span>
      ))}
    </Note>
  );
};

export default App;
