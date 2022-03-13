const express = require('express');
const router = express.Router();
const pool = require('../database');

/*Rutas definitivas*/
router.get('/home/clientes', async(req, res) => {
	const datosClientes = await pool.query('SELECT * FROM clientes');
    console.log('Este es el resultado de clientes: ');
    console.log(datosClientes);
    res.render('Clientes.hbs', {datosClientes: datosClientes, 'menu': 'si'}); 
});



module.exports = router; 