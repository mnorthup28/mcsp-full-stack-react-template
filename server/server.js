import express from "express";
import postgres from "postgres";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;
const sql = postgres(process.env.DATABASE_URL);
const app = express();

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

await client.connect();

app.use(express.json());
app.use(cors());

app.get("/api/tasks", (req, res) => {
  sql`SELECT * FROM tasks`.then((rows) => {
    console.log(rows[0].id);
    res.send(rows);
  });
});

app.get("/api/tasks/:id", (req, res) => {
  const noteId = req.params.id;
  sql`SELECT * FROM tasks WHERE id = ${noteId}`
    .then((data) => {
      if (data.length == 0) {
        console.log("There is no task with that ID");
        res.sendStatus(404);
      } else {
        console.log(
          `The value of id ${noteId}: ${data[0].task} due by ${data[0].due}.`
        );
        res.send(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching task:", error);
      res.status(500);
    });
});

app.post("/api/tasks", (req, res) => {
  const { note } = req.body;
  if (note.length == 0) {
    console.log("Please fill out the chore to do");
    res.sendStatus(400);
  }
  const newTask = { note };
  console.log(newTask);
  sql`INSERT INTO tasks (name, due, completed) VALUES (${newTask.name}, ${newTask.due}, ${newTask.completed}) RETURNING *`
    .then((data) => {
      console.log(data.rows[0]);
      res.send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
