const http = new XMLHttpRequest();



function changeConfiguration(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ChangeConfiguration", "stationId": stationId});
	ws.send(PayloadRequest);
}

function setChargingProfile(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "SetChargingProfile", "stationId": stationId});
	ws.send(PayloadRequest);
}


function clearChargingProfile(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ClearChargingProfile", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getLocalListVersion(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetLocalListVersion", "stationId": stationId});
	ws.send(PayloadRequest);
}

function sendLocalList(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "SendLocalList", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getCompositeSchedule(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetCompositeSchedule", "stationId": stationId});
	ws.send(PayloadRequest);
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



function buttons_changeAvailability(){
	ventana_configuracion.innerHTML= "<div class='custom-control custom-switch'>"+
	"<input type='checkbox' class='custom-control-input' id='CCS' onchange='ChangeAvailability(1,this.id)'>"+
	"<label class='custom-control-label' for='CCS'>Conetor CCS</label> &nbsp;"+ 
"</div>"+
"<div class='custom-control custom-switch'>"+
"	<input type='checkbox' class='custom-control-input' id='Chademo' onchange='ChangeAvailability(1,this.id)'>"+
	"<label class='custom-control-label' for='Chademo'>Conetor Chademo</label>&nbsp;"+ 
"</div>"+
"<div class='custom-control custom-switch'>"+
	"<input type='checkbox' class='custom-control-input' id='AC' onchange='ChangeAvailability(1,this.id)'>"+
	"<label class='custom-control-label' for='AC'>Conetor AC</label>&nbsp;"+
"</div>"
}


function ChangeAvailability(stationId,id){
	//console.log('Hola');
	
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
	
}

function buttons_unlockConnector(){
	ventana_configuracion.innerHTML=
"<div style='margin-top:10px'>"+
	"<label>Conector CCS</label>"+	
	"<button id='UnCCS' onclick='UnlockConnector(1,this.id)' class='btn btn-info'>Desbloquear</button>"+
"</div>"+
"<div style='margin-top:10px'>"+
	"<label>Conector Chademo</label>"+
	"<button  id='UnChademo' onclick='UnlockConnector(1,this.id)' class='btn btn-info'>Desbloquear</button>"+
"</div>"+
"<div style='margin-top:10px'>"+
	"<label>Conector AC</label>"+
	"<button id='UnAC' onclick='UnlockConnector(1,this.id)' class='btn btn-info'>Desbloquear</button>"+
"</div>"
}

function UnlockConnector(stationId, id){
	//var conectorbutton= document.getElementById(id).id;
	var idConector;
	console.log('stationId: ' + stationId);
	if(id=="UnCCS"){
		idConector=1;


	}else if(id=="UnChademo"){

		idConector=2;

	}else if(id=="UnAC"){
		idConector=3;
	}
	var PayloadRequest = JSON.stringify({"tipo": "UnlockConnector","Conector":idConector,"stationId": stationId});
	ws.send(PayloadRequest);

}



function david(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ReserveNow", "stationId": stationId});
	ws.send(PayloadRequest);
	
}

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
	console.log('datos estacion: ');
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