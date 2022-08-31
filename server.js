/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const morgan = require('morgan');
const path = require('path');

/* ---------------------- INSTANCIA DE SERVER -----------------------*/
const app = express();
const router = require('./src/routes/productos.routes.js');

/* ---------------------- MOTOR DE PLANTILLAS -----------------------*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* -------------------------- MIDDLEWARES ---------------------------*/
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));

/* ------------------------------ RUTAS -----------------------------*/
app.use('/', router)

/* ---------------------------- SERVIDOR ----------------------------*/
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})

server.on('error', err => {
    console.log(`Server error: ${err}`);
})