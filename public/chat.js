const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  const roomInput = document.getElementById('room-input');
  const joinRoomBtn = document.getElementById('join-room-btn');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chatBox = document.getElementById('chat-box');

  let currentRoom = '';
  let userId = Math.random().toString(36).substring(7); // Generate a simple unique ID for each user

  joinRoomBtn.addEventListener('click', () => {
    const room = roomInput.value.trim();
    if (room) {
      socket.emit('joinRoom', room);
      currentRoom = room;
      chatBox.innerHTML = '';
      roomInput.value = '';
    }
  });

  sendBtn.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg) {
      const messageData = { userId, msg };
      socket.emit('chatMessage', messageData);
      displayMessage(messageData, true); // Display the sender's message on the right
      chatInput.value = '';
    }
  });

  socket.on('chatMessage', (messageData) => {
    if (messageData.userId !== userId) {
      displayMessage(messageData, false); // Display other users' messages on the left
    }
  });

  function displayMessage(messageData, isSender) {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    msgElement.classList.add(isSender ? 'message-sender' : 'message-receiver');
    msgElement.textContent = messageData.msg;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

