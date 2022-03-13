function toClientProfile(client){
	console.log('Estos son los datos del cliente especifico: ');
	console.log(client);
	document.getElementById('clientProfile').style.display = 'block';
	document.getElementById('clientsDetails').style.display = 'none';
}

function toClientsDetails(){
	document.getElementById('clientProfile').style.display = 'none';
	document.getElementById('clientsDetails').style.display = 'block';

}