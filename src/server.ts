import e from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = e();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", e.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = createServer(app);
const wss = new WebSocketServer({ server });

server.listen(PORT, () =>
  console.log(`Zoom app listening on port: http://localhost:${PORT} 🚀`)
);
