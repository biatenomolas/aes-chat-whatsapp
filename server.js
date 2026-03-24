const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("Un pote s'est connecté →", socket.id);

    socket.on("sendEncrypted", (data) => {
        console.log("Message chiffré reçu, je le renvoie aux autres");
        socket.broadcast.emit("receiveEncrypted", data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT} - Prêt pour l'exposé !`);
});