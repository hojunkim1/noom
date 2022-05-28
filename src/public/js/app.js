const messageUl = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server");
});

socket.addEventListener("message", (event) => {
  console.log(`New message: ${event.data}`);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server");
});

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
