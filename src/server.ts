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

declare module "ws" {
  interface WebSocket {
    nickname: string;
    new_message: string;
  }
}

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("connected to client");
  socket.on("close", () => console.log("disconnected from client"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket["nickname"]}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(PORT, () =>
  console.log(`Zoom app listening on port: http://localhost:${PORT} 🚀`)
);
