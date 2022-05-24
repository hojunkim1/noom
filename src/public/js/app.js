const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server");
});

socket.addEventListener("message", (event) => {
  console.log(event.data);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server");
});

setTimeout(() => {
  socket.send("hello from client");
}, 10000);
