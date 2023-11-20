-- DATABASE name is ReactMVPDB
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS deletedTasks;


CREATE TABLE tasks (
  id SERIAL,
  task TEXT,
  due TEXT,
  completed boolean
);

CREATE TABLE deletedTasks (
  id SERIAL,
  deletedTask TEXT
);

INSERT INTO tasks(task, due, completed) VALUES('Groceries', 'Dec 1', false);
insert INTO deletedTasks(deletedTask) VALUES('Run that thing');

