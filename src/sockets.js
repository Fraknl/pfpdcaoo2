const crypto = require('crypto');
const { urlencoded, text } = require('express');
//const { url } = require('inspector');
const { type } = require('os');
const pool = require('./database.js');
const funciones = require('./funciones.js');
var clientes = new Map();
const ffs = require('./ocppFunctions');
const ffsnav = require('./ocppFunctionsServer');
const path = require('path');
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

var miIp = "";
for(const prop in results){
    console.log(prop);
    if(prop=='Wi-Fi'){
        miIp = results[prop][0];
    }else if(prop=='Ethernet'){
        miIp = results[prop][0];
    }
}

console.log('Esta es mi IP: ');
console.log(miIp);

const FtpSrv = require('ftp-srv');
/*const miIp = '192.168.222.201';
const miIpLocal = '192.168.1.20';*/
const uriFTP = 'ftp://'+miIp+':21/';
const ftpServer = new FtpSrv({'url': uriFTP,
'greeting': 'Saludo de bienvenida desde servidor OCPP'});
const blacklist = [];
const whitelist = ['DIR', 'PWD', 'CWD', 'TYPE', 'PASV', 'PORT', 'LIST', 'STOR'];

ftpServer.on('login', (data, resolve, reject) => {
    var username = data.username;
    var password = data.password;
    //if(username=='admin' && password=='ftp123'){
        //console.log('Credenciales FTP correctas')
        const rutaFTP = '/src/public/diagnostics/';
        const res = {'cwd': rutaFTP, 'blacklist': blacklist, 'whitelist': whitelist}
        resolve(res);
    //}
    /*else{
        reject();
    }*/
    
 });

ftpServer.listen()
.then(() => { console.log('Servidor FTP escuchando') });


var generateAcceptValue = function (acceptKey) {
    return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
};


var responseHeaders = function(req){
    const acceptKey = req.headers['sec-websocket-key'];
    const hash = generateAcceptValue(acceptKey);
    const response = [ 
        'HTTP/1.1 101 Switching Protocols', 
        'Upgrade: WebSocket', 
        'Connection: Upgrade', 
        `Sec-WebSocket-Accept: ${hash}`
    ];

    const protocol = req.headers['sec-websocket-protocol'];
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());

    if (protocols.includes('ocpp1.6')) {
        console.log('Ha solicitado el subprotocolo ocpp1.6')
        response.push('Sec-WebSocket-Protocol: ocpp1.6');
    };
    console.log('Respuestas a enviar: ');
    console.log(response.join('\r\n') + '\r\n\r\n');
    return response;
}

var responseHeaders1 = function(acceptKey, protocol){
    const hash = generateAcceptValue(acceptKey);
    const response = [ 
        'HTTP/1.1 101 Switching Protocols', 
        'Upgrade: WebSocket', 
        'Connection: Upgrade', 
        `Sec-WebSocket-Accept: ${hash}`
    ]; 
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());

    if (protocols.includes('ocpp1.6')) {
        console.log('Ha solicitado el subprotocolo ocpp1.6')
        response.push('Sec-WebSocket-Protocol: ocpp1.6');
    };
    console.log('Respuestas a enviar: ');
    console.log(response.join('\r\n') + '\r\n\r\n');
    return response;
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
}

module.exports = function(server){
    server.on('upgrade',  async(req, socket) => { 
        var url_est = req.url.substring(1,req.url.length);
        console.log('                                           ');
        console.log('------------------------------------------------------');
        console.log('Un cliente quiere establecer un websocket: ');
        console.log('Identidad del cliente: ' + url_est)
        var clave;
        if (req.headers['upgrade'] !== 'websocket') {
            socket.end('HTTP/1.1 400 Bad Request');
            return;
        }; 
        
        
        let query = 'SELECT id_estacion FROM estaciones WHERE codigo_estacion="' + url_est + '";';
        let estaciones = await pool.query(query);
        console.log('resultado sql de estaciones');
        console.log(estaciones)


        if(estaciones.length!=0){
            response = responseHeaders(req);
            clave = estaciones[0].id_estacion;
            socket.write(response.join('\r\n') + '\r\n\r\n' );

        }else{
            console.log('La estacion no ha sido agregada aun');
            //socket.end('HTTP/1.1 400 Bad Request');
            clientes.set('temporal', socket);
            clientenav = clientes.get(0);
            const acceptKey = req.headers['sec-websocket-key'];
            const protocol = req.headers['sec-websocket-protocol'];

            var resp = {'tipo': 'UnautorizedClient', 'element':'firstWsHandshake', 'texto': url_est, 
            'acceptKey': acceptKey, 'protocol': protocol}
            clientenav.write(funciones.constructReply(resp, 0x1));

            return;
        }
     
        console.log('Estado del socket: ' + socket.readyState);
        if(socket.readyState=='open'){
            clientes.set(clave, socket);
        };

        socket.on("data", async(buffer) => {
            
            const lista = funciones.parseMessage(buffer);
            //lista = [mensaje, codigo_operacion]
            if (lista==null){
                return;
            };  

            var message = lista[0]; 
            
            console.log('                                      ');
            console.log('El servidor ha recibido datos----------------------------------------------------------------------');
            console.log('Tipo de dato: ' + typeof(message));
            console.log(message);
            const opCode = lista[1]; 
            const CallId = 2;       
            const CallResultId = 3;
            const CallErrorId = 4;

            if (opCode === 0x1 ) {
                console.log('codigo de operacion 1')
                const MessageTypeId = message[0];
                const UniqueId = message[1];
                var PayloadResponse;

                if (MessageTypeId==2){ 
                    /*************Respuesta para punto de carga*************** */
                    Respuestas = await ffs.funcionesnuevas(message);
                    PayloadResponse = Respuestas[0];
                    PayloadResponseNav = Respuestas[1];
                    console.log('                                            ');
                    let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
                    console.log('Respuesta a enviar al punto de carga: ')
                    console.log(CallResult);
                    socket.write(funciones.constructReply(CallResult, opCode));

                    /*************Respuesta para navegador****************/
                    if(PayloadResponseNav){ 
                        clientenav = clientes.get(0);
                        if(clientenav){
                            var id_est = getByValue(clientes, socket);
                            PayloadResponseNav.boton = PayloadResponseNav.tipo + id_est;
                            console.log('Respuesta a enviar al navegador: ')
                            console.log(PayloadResponseNav);
                            clientenav.write(funciones.constructReply(PayloadResponseNav, opCode))
                        }else{
                            console.log('Navegador no conectado');
                        } 
                    }
                    

                }else if (MessageTypeId==3){
                    clientenav = clientes.get(0);
                    
                    console.log('Se ha recibido un MessageTypeId igual a 3!')
                    console.log(message[2]);
                    var Response = {
                        'texto': JSON.stringify(message[2]),
                        'tipo': 'recibidos',
                        'boton': 'stationResponse'
                    };
                    clientenav.write(funciones.constructReply(Response, opCode));


                }else{
                    console.log('Se ha recibido un mensaje desde navegador!')
                    console.log('mensaje parseado en json: ');
                    console.log(message);
                    var stationId = message.stationId;
                    var stationClient = clientes.get(stationId);
                    console.log('Este  es el cliente: ');
                    //console.log(stationClient);

                    if(stationClient!=undefined){

 
                    }else if(message.tipo=='ReserveNow'){
                        var stationId = message.stationId;
                        console.log('Servidor recibe get diagnostics');
                        console.log('Y el id de la estacion: ');
                        console.log(stationId);
                        var stationClient = clientes.get(stationId);
                        //PayloadRequest = {"location": uri.toString()};
                        PayloadRequest = {"connectorId": 1,"expiryDate":"2022-02-28T11:10:00.000Z","idTag":"7240E49A","reservationId":100};

                        var OIBCS = [2, '10', message.tipo, PayloadRequest];
                        stationClient.write(funciones.constructReply(OIBCS, 0x1))



                        if(message.tipo=='acceptWsHandshake'){
                            console.log('navegador solicita aceptar la conexion')
                            var temporalClient = clientes.get('temporal');
                            const acceptKey = message.acceptKey;
                            const protocol = message.protocol;
                            response = responseHeaders1(acceptKey, protocol);
                            temporalClient.write(response.join('\r\n') + '\r\n\r\n' );
                            //temporalClient.write(funciones.constructReply(response, 0x1));
                        }else if(message.tipo=='ReserveNow'){
                            PayloadRequest = {"connectorId": 1,"expiryDate":"2022-02-28T11:10:00.000Z","idTag":"7240E49A","reservationId":100};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1))
                        }else if(message.tipo=='CancelReservation'){
                            PayloadRequest = {"reservationId": 100};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='ChangeAvailability'){
                            PayloadRequest = {"reservationId": '1'};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='ChangeConfiguration'){
                            PayloadRequest = {"reservationId": '1'};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='GetDiagnostics'){
                            PayloadRequest = {"location": uriFTP};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='GetConfiguration'){
                            PayloadRequest = {"key": ['SupportedFileTransferProtocols']};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else{
                            clientenav = clientes.get(0);
                            PayloadResponse = await ffsnav.funcionesNuevasNav(message, clientes)
                            console.log('                                            ');
                            console.log('El servidor respondes-------------------')
                            let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
                            console.log(CallResult);
                            socket.write(funciones.constructReply(CallResult, opCode));
                        }

                    }else{
                        clientenav = clientes.get(0);
                        var Response = {
                            'texto': 'No hay una estacion conectada',
                            'tipo': 'recibidos',
                            'boton': 'stationResponse'
                        };
                        clientenav.write(funciones.constructReply(Response, opCode));
                    }
                };

            }else if(opCode === 0x9){
                console.log('Entra a op9')
                console.log('Tipo de dato: ping');
                console.log('Contenido: ');
                console.log(message);
                console.log('                                            ');
                console.log('El servidor responde con un pong: ');
                console.log(message);
                socket.write(funciones.constructReply(message, opCode));
                var textnav;
                var id_est = getByValue(clientes, socket);
                let ide = 'ping'+id_est;
                console.log('id de estacion html ' + ide);
                textnav = {'tipo':'ping', 'boton':ide, 'texto':'Recibiendo Pings'};
                
                cliente = clientes.get(0);
                console.log('este es el cliente: ');
                console.log(clientes.keys());
                
                if (cliente){
                    console.log('Si existe el cliente: ')
                    cliente.write(funciones.constructReply(textnav, 1));
                }
            }
        });
    }); 
};


