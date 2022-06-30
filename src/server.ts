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

// Type alias
type Roomname = string;
type Nickname = string;
type Message = string;
type Listener = (...args: any[]) => void;

// Declare socket object
declare module "socket.io" {
  interface Socket {
    nickname: Nickname;
  }
}

io.on("connection", (socket) => {
  // Log events
  socket.onAny((event: string) => {
    console.log(`Socket Event: ${event}`);
  });

  // Save nickname
  socket.on("nickname", (name: Nickname) => {
    socket["nickname"] = name;
  });

  // Send welcome message
  socket.on("enter_room", (room: Roomname, name: Nickname, cb: Listener) => {
    socket.join(room);
    name ? (socket["nickname"] = name) : (socket["nickname"] = "Anon");
    cb();
    socket.to(room).emit("welcome", socket.nickname);
  });

  // Send message
  socket.on("new_message", (room: Roomname, msg: Message, cb: Listener) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    cb();
  });

  // Send bye message
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
});

server.listen(PORT, () =>
  console.log(`Zoom app listening on port: http://localhost:${PORT} 🚀`)
);
