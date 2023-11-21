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
  database: "ReactMVPDB",
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
  const { task, due, completed } = req.body;
  const newTask = { task, due, completed };
  if (newTask.length === 0) {
    console.log("Please fill out the chore to do");
    res.sendStatus(400);
  }
  console.log(newTask);
  client
    .query(
      `INSERT INTO tasks(task, due, completed) VALUES ($1, $2, $3) RETURNING *`,
      [task, due, completed]
    )
    .then((data) => {
      console.log(data.rows[0]);
      res.send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  const noteId = req.params.id;
  client
    .query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [noteId])
    .then((data) => {
      if (data.rows[0] !== undefined) {
        console.log("We deleted: ", data.rows[0]);
        res.status(200);
        res.json(data.rows[0]);
      } else {
        console.log("We can't delete because no tasking has the ID");
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { task, due, completed } = req.body;

  client
    .query(
      `UPDATE tasks SET task = COALESCE ($1, task), due = COALESCE ($2, due), completed = COALESCE ($3, completed) WHERE id = $4 RETURNING *`,
      [task, due, completed, id]
    )
    .then((data) => {
      if (data.rows.length == 0) {
        res.sendStatus(404);
      } else res.send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// for the deleted table

// app.get("/api/deletedTasks", (req, res) => {
//   sql`SELECT * FROM deletedTasks`.then((rows) => {
//     console.log(rows[0]);
//     res.send(rows);
//   });
// });

// app.get("/api/deletedTasks/:id", (req, res) => {
//   const noteId = req.params.id;
//   sql`SELECT * FROM deletedTasks WHERE id = ${noteId}`
//     .then((data) => {
//       if (data.length == 0) {
//         console.log("There is no task with that ID");
//         res.sendStatus(404);
//       } else {
//         console.log(`The value of id ${noteId}: ${data[0].deletedTask}.`);
//         res.send(data[0]); // Use res.send(data[0]) for a single task
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching task:", error);
//       res.status(500).send(error);
//     });
// });

// app.post("/api/deletedTasks", (req, res) => {
//   const { deletedTask } = req.body;
//   const newTask = { deletedTask };
//   if (newTask.length === 0) {
//     console.log("Please fill out the chore to do");
//     res.sendStatus(400);
//   }
//   console.log(newTask);
//   client
//     .query(`INSERT INTO deletedTasks(deletedTask) VALUES ($1) RETURNING *`, [
//       deletedTask,
//     ])
//     .then((data) => {
//       console.log(data.rows[0]);
//       res.send(data.rows[0]);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// });

// app.delete("/api/deletedTasks/:id", (req, res) => {
//   const noteId = req.params.id;
//   client
//     .query(`DELETE FROM deletedTasks WHERE id = $1 RETURNING *`, [noteId])
//     .then((data) => {
//       if (data.rows[0] !== undefined) {
//         console.log("We deleted: ", data.rows[0]);
//         res.status(200);
//         res.json(data.rows[0]);
//       } else {
//         console.log("We can't delete because no tasking has the ID");
//         res.sendStatus(404);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
