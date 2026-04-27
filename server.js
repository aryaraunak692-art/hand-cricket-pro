const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const app=express();
const server=http.createServer(app);
const io=new Server(server);
app.use(express.static('public'));
let rooms={};
function code(){return Math.random().toString(36).substring(2,7).toUpperCase();}
io.on('connection',(socket)=>{
 socket.on('createRoom',({name})=>{
   const room=code();
   rooms[room]={room,players:[socket.id],score1:0,score2:0,innings:1,target:null,choices:{},message:'Waiting for Player2',finished:false,winner:null};
   socket.join(room); io.to(socket.id).emit('gameState',rooms[room]);
 });
 socket.on('joinRoom',({name,room})=>{
   if(!rooms[room]) return;
   socket.join(room); rooms[room].players.push(socket.id); rooms[room].message='Match Started!';
   io.to(room).emit('gameState',rooms[room]);
 });
 socket.on('playTurn',({choice})=>{
   const room=Object.keys(rooms).find(r=>rooms[r].players.includes(socket.id)); if(!room) return;
   const g=rooms[room]; g.choices[socket.id]=choice;
   if(Object.keys(g.choices).length===2){
      const ids=Object.keys(g.choices); const c1=g.choices[ids[0]], c2=g.choices[ids[1]];
      if(g.innings===1){ if(c1===c2){g.innings=2;g.target=g.score1+1;g.message='Player1 OUT! Target '+g.target;} else {g.score1+=c1;g.message='Player1 scored '+c1;}}
      else { if(c1===c2){g.finished=true;g.winner='Player1';g.message='Player2 OUT!';} else {g.score2+=c2; if(g.score2>=g.target){g.finished=true;g.winner='Player2';g.message='Player2 Wins!';} else {g.message='Player2 scored '+c2;}}}
      g.choices={}; io.to(room).emit('gameState',g);
   }
 });
});
const PORT=process.env.PORT||3000;
server.listen(PORT,'0.0.0.0',()=>console.log('Server running on '+PORT));