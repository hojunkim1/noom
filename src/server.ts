import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = e();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/assets", e.static("assets"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  // Log events
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  // Send welcome message
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  // Send bye message
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  // Send message
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

server.listen(PORT, () =>
  console.log(`Zoom app listening on port: http://localhost:${PORT} 🚀`)
);
