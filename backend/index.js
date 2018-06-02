var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;



server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var clients = 0;
// Routing
app.use(express.static(__dirname + '/public'));

var button = {};
var buttons = {};
var buttonspressed = [];
//var clients = [];


var buttonspressed = [];
var connections = [];
for(var i=1;i<=9;i++){
  buttons[i]= {};
  buttonspressed[i] = 0;
}



io.on('connection', function (socket) {
  if(clients<9){
    
    occupants(socket);
    console.log("got 1 connection");
    clients++;
    console.log('number of clients : '+clients);
    socket.on("type",function(data){
      console.log("connections before");
      console.log(connections);
      console.log("data");
      console.log(data);
      // for(var i=0;i<connections.length;i++){
      //   if(connections[i].socketId===socket.id){
      //     connections[i].socket.disconnect();
      //   }
      // }
      connections.push({socketId:socket.id,type:data,socket:socket});
      console.log("connections after");
      console.log(connections);
    });
	
    socket.on('sendMessage',function(data){
      console.log("Message : "+data);

		socket.emit('ack', { hello: 'world' });
        socket.broadcast.emit('message',{hello: data});
        //socket.broadcast.emit('nm',{title:'new button',message:''+data+' pressed'});
        console.log('after reserving buttons');
      

    });
    socket.on('disconnect',function(){
      for(var i=0;i<connections.length;i++){
        if(connections[i].socketId===socket.id){
          connections.splice(i,1);
        }
      }
      console.log('connections');
      console.log(connections);
      console.log('socket disconnected');
      clients--;
      console.log('number of clients : '+clients);
      console.log("after disconnection");

    });
  }
  else {
    socket.disconnect();
  }
});

function occupants(socket){
  if(clients>0){
      console.log('clients > 0');
      var contains = false;
      var jsonarr = [];
      for(var i=1;i<=9;i++){
        if(buttonspressed[i] === 1){
          contains = true;
          jsonarr.push({num:i});
          console.log(jsonarr);
        }
      }
      if(contains){
        console.log('sending existing data');
        socket.emit('preOccupied',jsonarr);
      } 
    }
}

