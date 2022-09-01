const socket = io.connect();

socket.on('from-server-messages', data => {
    render(data.DB_MESSAGES);
})

const render = (messages) => {
    const allMessages = messages.map((msg) => {
        return `
        <span>
            <b style="color:blue;">${msg.author}</b>
            <small style="color:crimson;"> [${msg.date}] </small> <b style="color:blue;">:</b>
            <i style="color:green;"> ${msg.message} </i>
        </span>
        ` }).join('<br>');

    document.querySelector('#messagesRecord').innerHTML = allMessages;
}

function sendMessage() {
    const inputUser = document.getElementById('#user');
    const inputMessage = document.getElementById('#messageContent');
    const inputDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const msj = {
        author: inputUser.value,
        date: inputDate,
        message: inputMessage.value
    }

    socket.emit('from-client-messages', msj)
}