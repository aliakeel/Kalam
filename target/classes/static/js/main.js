'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var usersArea = document.querySelector('#users');
var connectingElement = document.querySelector('.connecting');
var user = document.querySelector('#user');

var stompClient = null;
var username = null;
var inFormOrLink;
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/websocket');
        stompClient = Stomp.over(socket);
        socket.onclose = function () {
            stompClient.send("/app/chat.send", {},
                JSON.stringify({
                    sender: username,
                    type: 'LEAVE'
                })
            )
        }
        stompClient.connect({}, onConnected, onError);

    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    // user.content = username;
    // Tell your username to the server
    stompClient.send("/app/chat.register", {},
        JSON.stringify({
            sender: username,
            type: 'JOIN'
        })
    )
    user.textContent = username;
    connectingElement.classList.add('hidden');
}

function logout() {
    stompClient.send("/app/chat.send", {},
        JSON.stringify({
            sender: username,
            type: 'LEAVE'
        })
    )
    stompClient.disconnect();
}


function onError(error) {
    connectingElement.textContent = 'Não foi possível se conectar ao WebSocket! Atualize a página e tente novamente ou entre em contato com o administrador.';
    connectingElement.style.color = 'red';
}


function send(event) {
    var messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {

        if (message.sender != username) {
            messageElement.classList.add('event-message');
            message.content = message.sender + ' joined!';
            addNewUser(message.sender);
        } else {
            message.users.forEach(element => {
                if (element.name != username)
                    addNewUser(element.name);
            });
            return;
        }

    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');
        if (message.sender != username) {
            messageElement.classList.add('other');
        }
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function addNewUser(user_joined) {
    var li_element = document.createElement('li');
    var messageText = document.createTextNode(user_joined);
    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(user_joined[0]);
    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(user_joined);
    usernameElement.appendChild(usernameText);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(user_joined);
    li_element.appendChild(avatarElement);
    li_element.appendChild(usernameElement)
    usersArea.appendChild(li_element);
    usersArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', send, true)

window.addEventListener('beforeunload', function (e) {
    if (stompClient.connected) {
        logout();
    }

    e.returnValue = '';
});

function resize() {
    if (window.innerWidth < 1000) {
        $(".chat-users").hide();
    }
}
window.addEventListener('resize', resize);

function menu() {
    var chatUsers = document.querySelector('.chat-users');
    console.log('fdvdgfd');
    if (!chatUsers.classList.contains('front'))
        $(".chat-users").toggle("slide");
    else
        $(".chat-users").toggle("slide");
}

function hide(evt) {
    console.log(dfsgfds);
    var chatUsers = document.querySelector('.chat-users');
    if (chatUsers.classList.contains('front'))
        chatUsers.classList.remove('front');
    const el = document.querySelector('.chat-container');
    el.removeEventListener('touchstart', hide);
}


$(document).ready(function () {
    if (window.innerWidth < 900) {
        $(".chat-users").hide();
    }
});