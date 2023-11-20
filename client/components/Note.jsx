import React, { useState } from "react";

const Note = ({ onSubmit }) => {
  const [noteData, setNoteData] = useState("");
  const [dueDate, setDueDate] = useState("");

  const makeNote = (event) => {
    setNoteData(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const submitNoteData = (event) => {
    event.preventDefault();
    const taskData = { task: noteData, dueDate: dueDate, completed: false };
    if (taskData.task.length === 0 || taskData.dueDate.length === 0) {
      alert("please fill out data");
    } else {
      onSubmit(taskData);
    }
    setNoteData("");
    setDueDate("");
  };

  return (
    <form id="note" data-testid="note" onSubmit={submitNoteData}>
      <label>
        <input
          type="text"
          placeholder="What needs to be done?"
          onChange={makeNote}
          value={noteData}
        />
        <input
          type="text"
          placeholder="When is it due?"
          onChange={handleDueDateChange}
          value={dueDate}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Note;
