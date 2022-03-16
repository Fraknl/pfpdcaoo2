const express = require('express');
const router = express.Router();
const pool = require('../database');

function invierte_fecha(fecha){
    const months = ["Enero","Febrero","Marzo","Abril","May","June","July","August","September","October","November","December"];
    console.log('tipo de dato: ' + typeof(fecha));
    console.log('fecha original: ');
    console.log(fecha);
    let year = fecha.getFullYear()
    let month = months[fecha.getMonth()];
    let day = fecha.getDate()
    let fecha_invertida = day + '-' + month + '-' + year;
    return fecha_invertida
}
/*Rutas definitivas*/
router.get('/home/clientes', async(req, res) => {
	const datosClientes = await pool.query('SELECT * FROM clientes');
    console.log('Este es el resultado de clientes: ');
    
    datosClientes.forEach(element => {
        console.log(element);
        element.fecha_registro = invierte_fecha(element.fecha_registro);
    });
    res.render('Clientes.hbs', {datosClientes: datosClientes, 'menu': 'si'}); 
});



module.exports = router; 