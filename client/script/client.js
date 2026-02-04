import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const otherChats = document.getElementById('otherChats');
const deleteChatBtn = document.getElementById('deleteChat');
const newUsernameBtn = document.getElementById('newUsername');

const getUsername = async () => {
    const username = sessionStorage.getItem('username')
    if (username) {
        return username
    }
    const res = await fetch('https://randomuser.me/api/')
    const data = await res.json()

    const randomUsername = data.results[0].login.username

    sessionStorage.setItem('username', randomUsername)
    return randomUsername
}

const username = await getUsername()

const welcomeMsg = document.createElement('p');
welcomeMsg.innerHTML = `Welcome: <strong>${username}</strong>`;
otherChats.prepend(welcomeMsg);

const socket = io({
    auth: {
        username: username,
        serverOffset: 0
    }
});

socket.on('chat message', (msg, serverOffset, msgUser) => {
    const isMine = msgUser === username

    const item = `<li class="${isMine ? 'my-message' : 'other-message'}">
                <small class="messageUsername">${msgUser}</small>
                <p>${msg}</p>
                </li>`;
    messages.insertAdjacentHTML('beforeend', item);
    socket.auth.serverOffset = serverOffset
    messages.scrollTop = messages.scrollHeight
});

socket.on('delete chat', () => {
    messages.innerHTML = '<p id="chatTitle">Nuevo Chat</p>';
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

deleteChatBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Deleting chat...');
    socket.emit('delete chat');
})

newUsernameBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    sessionStorage.removeItem('username')
    location.reload()
})