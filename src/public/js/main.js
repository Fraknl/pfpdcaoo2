const http = new XMLHttpRequest();
var cuadro_opciones=document.getElementById("Cuadro_opciones");

function confirmDelete(){
	var contr;
	contr=prompt('Por favor ingrese la contraseña de administración: ');
	if (contr == 'contraadmin'){
		return true; 
	}else{
		return false;
	}
}

function cancelReservation(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "CancelReservation", "stationId": stationId, "reservationId": 1});
	ws.send(PayloadRequest);
}

function getDiagnostics(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetDiagnostics", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getConfiguration(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetConfiguration", "stationId": stationId});
	ws.send(PayloadRequest);
}
function changeAvailability(stationId){
	cuadro_opciones.innerHTML= "<div>"+
	"<button onclick='cancelReservation(1)' class='btn btn-danger m-1'>Cancelar Reservacion</button>"+
	"<button onclick='changeAvailability(1)' class='btn btn-info m-1'>Cambiar Diposnibilidad</button>"+
	"<div>hola</div>"+
	"<button onclick='changeConfiguration(1)' class='btn btn-warning m-1'>Cambiar Configuración</button>"+
	"<button onclick='clearCache(1)' class='btn btn-success m-1'>Limpiar Caché</button>"+
	"<button onclick='clearChargingProfile(1)' class='btn btn-primary m-1'>Limpiar Perfil de Carga</button>"+
	"<button onclick='dataTransfer(1)' class='btn btn-secondary m-1'>Transferencia de Datos</button>"+
	"<button onclick='getCompositeSchedule(1)' class='btn btn-light m-1'>Obtener Horario Compuesto</button>"+
	"<button onclick='getConfiguration(1)' class='btn btn-dark m-1'>Obtener configuracion</button>"+
	"<button onclick='getDiagnostics(1)' class='btn btn-muted m-1'>Pedir diagnostico</button>"+
	"<button onclick='remoteStartTransaction(1)' class='btn btn-danger m-1'>Iniciar Transaccion Remota</button>"+
	"<button onclick='remoteStopTransaction(1)' class='btn btn-info m-1'>Detener Transaccion Remota</button>"+
	"<button onclick='getLocalLisVersion(1)' class='btn btn-warning m-1'>Obtener Version de Lista Local</button>"+
	"<button onclick='reserveNow(1)' class='btn btn-success m-1'>Reservar Ahora</button>"+
	"<button onclick='reset(1)' class='btn btn-primery m-1'>Resetear</button>"+
	"<button onclick='sendLocalList(1)' class='btn btn-secondary m-1'>Enviar Lista Local</button>"+
	"<button onclick='setChargningProfile(1)' class='btn btn-light m-1'>Establecer Perfil de Carga</button>"+
	"<button onclick='getLocalLisVersion(1)' class='btn btn-dark m-1'>Obtener Version de Lista Local</button>"+
	"<button onclick='triggerMessage(1)' class='btn btn-muted m-1'>Solicitar Operacion OCPP</button>"+
	"<button onclick='unlockConector(1)' class='btn btn-danger m-1'>Desbloquear Conector</button>"+
	"<button onclick='updateFirmware(1)' class='btn btn-info m-1'>Actualizar Firmware</button>"+
"</div>";


<<<<<<< HEAD
=======
function ChangeAvailability(stationId, id){
>>>>>>> 5caad7ffd79ac5da4500b220ebc9c8a63158ae53
	//console.log('Hola');
	/*
	var checkBox= document.getElementById(id);
	var idConector;
	console.log('stationId: ' + stationId);
	if(id=="CCS"){
		idConector=1;


	}else if(id=="Chademo"){

		idConector=2;

	}else if(id=="AC"){
		idConector=3;
	}
	if(checkBox.checked==true){
		var PayloadRequest = JSON.stringify({"tipo": "ChangeAvailability","Estado":"Operative","Conector":idConector,"stationId": stationId});
		ws.send(PayloadRequest);
	}
	else{
		var PayloadRequest = JSON.stringify({"tipo": "ChangeAvailability","Estado":"Inoperative","Conector":idConector, "stationId": stationId});
		ws.send(PayloadRequest);
	}
	*/
}




<<<<<<< HEAD
=======
function david(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ReserveNow", "stationId": stationId});
	ws.send(PayloadRequest);
	
}

>>>>>>> 5caad7ffd79ac5da4500b220ebc9c8a63158ae53
function xhr(){
	console.log('se llama a xhr')
	const url = '/home/estaciones/urlprueba';
	http.open("get", url);
	http.send();

	http.onreadystatechange=(e)=>{
		console.log('Respuesta desde el server: ' + http.responseText);
	}
}


function fromStationsToRealTime(){
	document.getElementById('').style.display = 'none';
	document.getElementById('').style.display = 'block';
}

function toStationDetails(id){
	//console.log('datos estacion: ');
	const url = '/home/estaciones/editar/'+id;
	http.open("get", url);
	http.send();

	http.onreadystatechange=(e)=>{
		var a = 1;
		//console.log('Respuesta desde el server: ' + http.responseText);
	}
	document.getElementById('stationDetails').style.display = 'block';
	document.getElementById('stationsDetails').style.display = 'none';
}

function toStationsDetails(){
	document.getElementById('stationDetails').style.display = 'none';
	document.getElementById('stationsDetails').style.display = 'block';
}
function toStationEdit(){
	document.getElementById('stationEdit').style.display = 'block';
	document.getElementById('stationDetails').style.display = 'none';
}

function sendFirstWsResponse(){
	document.getElementById('acceptWsHandshake');
	var storedAcceptKey = localStorage.getItem("acceptKey");
	var storedProtocol = localStorage.getItem("protocol");
	console.log('Si llega hasta aca: '); 
	console.log(storedAcceptKey);
	console.log(storedProtocol);
	console.log('Se va a aceptar la conexion:');
	const jsons = JSON.stringify({"tipo": "acceptWsHandshake", 
	'text':'conexion aceptada', 'message':'Esto es mensaje',
	'acceptKey': storedAcceptKey, 'protocol': storedProtocol});
	ws.send(jsons);
}


function setPageAddStation(){
	console.log('set page add station')
	document.getElementById('pageAddStation').style.display = 'block';
	document.getElementById('stationsDetails').style.display = 'none';
}

function fromAddToDetailsStations(){
	console.log('ir a pagina detalles estaciones')
	document.getElementById('pageAddStation').style.display = 'none';
	document.getElementById('stationsDetails').style.display = 'block';
}
function fromAdd2ToAdd1(){
	console.log('Pagina 1 add')
	document.getElementById('addStation1').style.display = 'block';
	document.getElementById('addStation2').style.display = 'none';
}

function addStation1(){
	var stationCode = document.getElementById("stationCode");
	var stationName = document.getElementById("stationName");
	var connectorNumber = document.getElementById("connectorNumber");
	//if(stationCode.value==="" || stationName.value==="" || connectorNumber.value===""){
		//alert('Debe llenar todos los campos para poder continuar')
	//}else{
		localStorage.setItem("stationCode", stationCode.value);
		localStorage.setItem("stationName", stationName.value);
		localStorage.setItem("connectorNumber", connectorNumber.value);
		document.getElementById("addStation1").style.display = "none";
		document.getElementById("addStation2").style.display = "block";
		console.log('Se ha dado click al boton siguiente');
	//}
}

function setFirstWS(){
	console.log('Primer ws')
	document.getElementById('waitingHS').style.display="block";
}

function addStation2(){
	console.log('Entra a addStation2');
}

function seeAntValues(){
	var storedValueCode = localStorage.getItem("stationCode");
	var storedValueName = localStorage.getItem("stationName");
	var storedValueConnector = localStorage.getItem("connectorNumber");
	console.log('Valores almacenados');
	console.log(storedValueCode);
	console.log(storedValueName);
	console.log(storedValueConnector);
}