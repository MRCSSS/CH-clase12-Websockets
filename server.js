/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const morgan = require('morgan');
const exphbs = require('express-handlebars');

/* ---------------------- INSTANCIA DE SERVER -----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const router = require('./src/routes/productos.routes.js');
 
/* ---------------------- MOTOR DE PLANTILLAS -----------------------*/
app.engine('hbs', exphbs.engine({
    defaultLayout: 'home',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* -------------------------- MIDDLEWARES ---------------------------*/
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

/* ------------------------------ RUTAS -----------------------------*/
app.use('/', router);

/* ---------------------------- WEBSOCKET ---------------------------*/
const DB_MESSAGES = [
    {
      "author": "Marcos",
      "date": "31/08/2022 12:36:30",
      "message": "Hola 1"
    },
    {
      "author": "Manuel",
      "date": "31/08/2022 12:36:31",
      "message": "Hola 2"
    },
    {
      "author": "Juan",
      "date": "31/08/2022 12:36:35",
      "message": "Hola 3"
    }
];

io.on('connection', (socket) => {
    console.log(`Client conected: ${socket.id}`);
    
    io.sockets.emit('from-server-messages', {DB_MESSAGES} );

    socket.on('from-client-messages', msj => {
        DB_MESSAGES.push(msj);
        console.log('DB_MESSAGES', DB_MESSAGES)
        io.sockets.emit('from-server-messages', {DB_MESSAGES});
    })
})

/* ---------------------------- SERVIDOR ----------------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})

// server.on('error', err => {
//     console.log(`Server error: ${err}`);
// })