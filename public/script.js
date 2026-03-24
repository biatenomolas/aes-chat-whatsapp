const socket = io();

let myName = prompt("Ton nom pour la simulation ? (ex: Alice)", "Alice") || "Alice";

function sendMessage() {
    const text = document.getElementById("messageInput").value.trim();
    const key = "1234567890123456";   // clé fixe pour l'exposé

    if (!text) return;

    const encrypted = CryptoJS.AES.encrypt(text, key).toString();

    addMessage("me", `
        <strong>${myName} :</strong><br>
        Original : ${text}<br>
        <span class="encrypted">🔒 ${encrypted}</span>
        <div class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
    `);

    socket.emit("sendEncrypted", { encrypted, sender: myName });

    document.getElementById("messageInput").value = "";
}

function addMessage(side, html) {
    const div = document.createElement("div");
    div.className = `message ${side}`;
    div.innerHTML = html;
    document.getElementById("messages").appendChild(div);
    div.scrollIntoView({ behavior: "smooth" });
}

socket.on("receiveEncrypted", (data) => {
    addMessage("other", `
        <strong>${data.sender} :</strong><br>
        🔒 Message chiffré reçu<br>
        <span class="encrypted">${data.encrypted}</span><br>
        <button class="decrypt-btn" onclick="decryptThis(this, '${data.encrypted}')">
            🔓 Déchiffrer
        </button>
        <div class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
    `);
});

function decryptThis(btn, encrypted) {
    const key = "1234567890123456";
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (decrypted) {
        btn.outerHTML = `<strong style="color:#4ade80;">🔓 ${decrypted}</strong>`;
    } else {
        btn.outerHTML = `<strong style="color:red;">❌ Mauvaise clé</strong>`;
    }
}