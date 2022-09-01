/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const router = express.Router();
const Contenedor = require('../fileSystem.js');
const path = require('path');

/* ------------------------- BASE DE DATOS --------------------------*/
const cont = new Contenedor('./public/productos.txt');

/* ------------------------------ RUTAS -----------------------------*/
router.get('/', async (req, res)=>{
    const products = await cont.getAll();
    console.log(path.join(__dirname, '../../views/partials', '/prod_table.hbs'));
    res.sendFile(path.join(__dirname, '../../views/partials', '/prod_table.hbs'), {products})
    // res.render('partials/prod_table',{products});
    res.status(200);
});

router.post('/productos', async (req, res)=>{
    const newID = await cont.save(req.body);
    const newProduct = {...req.body, id:newID}

    console.log('Agregado!', newProduct)
    res.redirect('/')
    res.status(201);
});


/*
router.get('/', async (req, res)=>{
    const products = await cont.getAll();
    res.status(200).json(products);
});

router.get('/:id', async (req, res)=>{
    const product = await cont.getById(req.params.id)
    res.status(200).json(product);
});

router.post('/', async (req, res)=>{
    const newID = await cont.save(req.body);
    const newProduct = {...req.body, id:newID}
    res.status(201).json({msg: 'Agregado!', data: newProduct});
});

router.put('/:id', async (req, res)=>{
    const prodUpd = await cont.update(req.params.id, req.body)
    res.status(200).json({msg: 'Actualizado!', data: prodUpd});
});

router.delete('/:id', async (req, res)=>{
    await cont.deleteById(req.params.id)
    res.status(200).json({msg: 'Eliminado!'});
});

router.get('*', async (request, response) => {
    response.status(404).send('404 - Page not found!!');
});
*/

module.exports = router;