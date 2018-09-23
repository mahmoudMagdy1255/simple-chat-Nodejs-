var express = require('express');

var fs = require('fs');

var socket = require('socket.io');

var app = express();

var server = app.listen(3333 , ()=>{
	console.log('Connecting To Server');
});

app.use( express.static('app') );

var sio = socket(server);

sio.on('connection', (socket)=> {
	console.log('New User Is Connected');

	socket.on('message', (message , username , room) => {

		socket.to(room).emit('message' , {message , username ,  'type' : 'message'});
	});

	socket.on('joinroom', (username , room) => {
		socket.join(room);

		var message = username + ' Join Room ' + room

		sio.sockets.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'});
	});


	socket.on('leaveroom', (username , room) => {
		socket.leave(room);

		var message = username + ' Leave Room ' + room;

		sio.sockets.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'});
	});

	socket.on('disconnect',  () => {

		var message = 'One Of Users Is Logged out';

		sio.sockets.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'})
	});

	socket.on('typing',  (username) => {

		var message = username + ' Is Typing A Message ...';

		socket.broadcast.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'})
	});

	socket.on('stopTyping',  (username) => {

		var message = username + ' Stop Typing A Message ';

		socket.broadcast.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'})
	});

	socket.on('logout',  (username) => {

		var message = username + ' Logged out';

		sio.sockets.emit('message' , {message , 'online_user' : socket.conn.server.clientsCount , 'type' : 'system'})
	});


});

