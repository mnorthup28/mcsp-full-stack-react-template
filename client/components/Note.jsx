import React, { useState } from "react";

const Note = ({ onSubmit }) => {
  const [noteData, setNoteData] = useState("");

  const makeNote = (event) => {
    setNoteData(event.target.value);
  };

  const submitNoteData = (event) => {
    event.preventDefault();
    onSubmit(noteData);
    setNoteData("");
  };

  return (
    <form id="note" data-testid="note" onSubmit={submitNoteData}>
      <input
        type="text"
        placeholder="What needs done?"
        onChange={makeNote}
        value={noteData}
      />
    </form>
  );
};

export default Note;
