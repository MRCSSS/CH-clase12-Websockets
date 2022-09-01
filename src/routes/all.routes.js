/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const router = express.Router();
const ProdContenedor = require('../prodsystem.js');
const MessagesContenedor = require('../msgsystem.js');

/* ------------------------- BASE DE DATOS --------------------------*/
const prods = new ProdContenedor('./public/productos.txt');
const msgs = new MessagesContenedor('./public/messages.txt');

/* ------------------------------ RUTAS -----------------------------*/
router.get('/', async (req, res)=>{
    const products = await prods.getAll();
    const messages = await msgs.getAll();

    res.render('layouts/home', { products, messages });
    res.status(200);
});

router.post('/productos', async (req, res)=>{
    const newID = await prods.save(req.body);
    const newProduct = {...req.body, id:newID}

    console.log('Agregado!', newProduct)
    res.redirect('/')
    res.status(201);
});

module.exports = router;