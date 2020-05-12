importScripts("./core.js", "https://cdn.jsdelivr.net/npm/socket.io-client@2/dist/socket.io.js");
const socket = io();
const coreHandler = new Core.EventHandler();
self.onmessage = (event) => {
    eventHandler.emit(event.data.name, event.data.data);
};
