/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const ProdContenedor = require('./src/prodsystem.js');
const MessagesContenedor = require('./src/msgsystem.js');
const morgan = require('morgan');

/* ---------------------- INSTANCIA DE SERVER -----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const router = require('./src/routes/all.routes.js');
 
/* ---------------------- MOTOR DE PLANTILLAS -----------------------*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* -------------------------- MIDDLEWARES ---------------------------*/
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

/* ------------------------------ RUTAS -----------------------------*/
app.use('/', router);

/* ------------------------- BASE DE DATOS --------------------------*/
const prods = new ProdContenedor('./public/productos.txt');
const msgs = new MessagesContenedor('./public/messages.txt');

/* ---------------------------- WEBSOCKET ---------------------------*/
io.on('connection', async (socket) => {
    const DB_PROD = await prods.getAll();
    const DB_MSG = await msgs.getAll();

    console.log(`Client conected: ${socket.id}`);
    
    io.sockets.emit('from-server-msg', {DB_MSG} );

    socket.on('from-client-msg', msg => {
        DB_MSG.push(msg);
        // console.log('DB_MSG', DB_MSG)
        io.sockets.emit('from-server-messages', {DB_MSG});
    })
})

/* ---------------------------- SERVIDOR ----------------------------*/
const PORT = 8081;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})

server.on('error', err => {
    console.log(`Server error: ${err}`);
})

