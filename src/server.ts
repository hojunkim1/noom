import e from "express";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

const app = e();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/assets", e.static("assets"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = createServer(app);
const wss = new WebSocketServer({ server });

const sockets: WebSocket[] = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("connected to client");
  socket.on("close", () => console.log("disconnected from client"));
  socket.on("message", (message) => {
    sockets.forEach((socket) => socket.send(message.toString("utf-8")));
  });
});

server.listen(PORT, () =>
  console.log(`Zoom app listening on port: http://localhost:${PORT} 🚀`)
);
