const socket = io();
const gameArea = document.getElementById('gameArea');
const statusBox = document.getElementById('status');

for(let i=1;i<=6;i++){
    gameArea.innerHTML += `<img src="fingers/${i}.png" onclick="play(${i})">`;
}

function createRoom(){
    const name = document.getElementById('name').value;
    if(name===""){
        alert("Enter your name first");
        return;
    }
    socket.emit('createRoom',{name});
}

function joinRoom(){
    const name = document.getElementById('name').value;
    const room = document.getElementById('roomCode').value;

    if(name==="" || room===""){
        alert("Enter name and room code");
        return;
    }

    socket.emit('joinRoom',{name,room});
}

function play(num){
    socket.emit('playTurn',{choice:num});
}

socket.on('gameState',(data)=>{

    statusBox.innerText =
    `ROOM ${data.room} | ${data.message} | INNINGS ${data.innings}`;

    document.getElementById('roomCode').value = data.room;

    document.getElementById('p1score').innerText = data.score1;
    document.getElementById('p2score').innerText = data.score2;

    if(data.finished){
        setTimeout(()=>{
            alert("🏆 WINNER : " + data.winner);
        },300);
    }
});