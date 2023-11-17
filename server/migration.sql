-- DATABASE name is ReactMVPDB
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL,
  task TEXT,
  due TEXT,
  completed boolean
);

INSERT INTO tasks(task, due, completed) VALUES('Groceries', 'Dec 1', false);

