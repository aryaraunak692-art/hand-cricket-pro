const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(__dirname));

// Homepage route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let rooms = {};

io.on("connection", socket => {
    console.log("User Connected");

    socket.on("createRoom", ({name}) => {
        let code = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[code] = {
            players: [{id: socket.id, name}],
            scores: {},
            toss: {},
            batting: null
        };
        socket.join(code);
        socket.emit("roomCreated", code);
    });

    socket.on("joinRoom", ({code, name}) => {
        if(rooms[code] && rooms[code].players.length < 2){
            rooms[code].players.push({id: socket.id, name});
            socket.join(code);
            io.to(code).emit("bothJoined", rooms[code].players);
        }
    });

    socket.on("disconnect", ()=> {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Server running on "+PORT));
