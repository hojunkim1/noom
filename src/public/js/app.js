const socket = io();

const welcome = document.getElementById("welcome"),
  welcomeForm = welcome.querySelector("form"),
  room = document.getElementById("room");

room.hidden = true;

// Add message to chat log
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

// Hide main room and create chat room
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const nicknameForm = room.querySelector(".room-nickname");
  const messageForm = room.querySelector(".room-message");
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
  messageForm.addEventListener("submit", handleMessageSubmit);
}

// Send room data to backend
function handleRoomSubmit(event) {
  event.preventDefault();
  const roomnameInput = welcome.querySelector(".lobby-roomname");
  const nicknameInput = welcome.querySelector(".lobby-nickname");
  socket.emit("enter_room", roomnameInput.value, nicknameInput.value, showRoom);
  roomName = roomnameInput.value;
  roomnameInput.value = "";
  nicknameInput.value = "";
}

// Send nickname data to backend
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector(".nickname input");
  socket.emit("nickname", input.value);
}

// Send chat data to backend
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector(".message input");
  const value = input.value;
  socket.emit("new_message", roomName, input.value, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} Joined!`);
});

socket.on("new_message", addMessage);

socket.on("bye", (user) => {
  addMessage(`${user} Left!`);
});
