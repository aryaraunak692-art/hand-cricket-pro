const socket = io();
const gameArea = document.getElementById("gameArea");
const statusText = document.getElementById("status");
const myRoom = document.getElementById("myRoom");

for(let i=1;i<=6;i++){
    gameArea.innerHTML += `<button class="finger" onclick="playFinger(${i})">${i}</button>`;
}

function createRoom(){
    const name = document.getElementById("name").value;
    if(name===""){
        alert("Enter your name");
        return;
    }
    socket.emit("createRoom",{name});
}

function joinRoom(){
    const name = document.getElementById("name").value;
    const code = document.getElementById("roomInput").value;
    if(name==="" || code===""){
        alert("Enter name and room code");
        return;
    }
    socket.emit("joinRoom",{code,name});
}

function playFinger(num){
    console.log("Played",num);
}

socket.on("roomCreated",(code)=>{
    myRoom.innerText = "YOUR ROOM CODE : " + code;
    statusText.innerText = "Send this code to friend";
    document.getElementById("roomInput").value = code;
});

socket.on("bothJoined",(data)=>{
    statusText.innerText = "Both Players Joined ✅ Match Ready";
});
