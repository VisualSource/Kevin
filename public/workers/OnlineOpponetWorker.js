importScripts("./core.js", "https://cdn.jsdelivr.net/npm/socket.io-client@2/dist/socket.io.js");
var socket = io("http://localhost:8000/kevin");
var Events = Core.Events, EventHandler = Core.EventHandler, reply = Core.reply;
var coreHandler = new EventHandler();
self.onmessage = function (event) { return coreHandler.emit(event.data.name, event.data.data); };
var config = {
    uuid: null,
    type: "SOCKET.IO"
};
socket.on("connect", function (event) { reply(Events.WEBSOCKET_READY, { system: config.type }); });
socket.on("connect_error", function (event) { });
socket.on("connect_timeout", function (event) { });
socket.on("reconnect", function (event) { });
socket.on("disconnect", function (event) {
    reply(Events.SOCKET_DISCONNECT, { error: event });
});
socket.on("opponent_init", function (data) {
    if (data.id !== socket.id)
        reply(Events.INIT, data.data);
});
socket.on(Events.NEW_GAME, function (data) {
    config.uuid = data.room;
    reply(Events.JOIN_CODE, { uuid: data.room });
});
coreHandler.addListener(Events.JOIN_GAME, function (code) {
    config.uuid = code.uuid;
    socket.emit(Events.JOIN_GAME, { uuid: config.uuid, id: socket.id });
    reply(Events.JOIN_CODE, { uuid: config.uuid });
});
coreHandler.addListener(Events.NEW_GAME, function () {
    socket.emit(Events.NEW_GAME, { restrict: false });
});
coreHandler.addListener(Events.INIT, function (event) {
    socket.emit(Events.INIT, { data: event, id: socket.id, room: config.uuid });
});
coreHandler.addListener(Events.KICK, function () { });
coreHandler.addListener(Events.GAME_START, function () { });
coreHandler.addListener(Events.STATUS_OPPONENT, function (event) { });
coreHandler.addListener(Events.JOIN_CODE, function () {
    reply(Events.JOIN_CODE, { uuid: config.uuid });
});
coreHandler.addListener(Events.REQUEST_DECK, function () { });
coreHandler.addListener(Events.READY, function (event) { });
coreHandler.addListener(Events.TURN_CHANGE, function (event) { });
