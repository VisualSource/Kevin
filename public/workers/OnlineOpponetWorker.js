importScripts("./core.js", "https://cdn.jsdelivr.net/npm/socket.io-client@2/dist/socket.io.js");
const socket = io("http://localhost:8000/kevin");
const { Events, EventHandler, reply, errorReply } = Core;
const coreHandler = new EventHandler();
self.onmessage = event => coreHandler.emit(event.data.name, event.data.data);
const config = {
    uuid: null,
    type: "SOCKET.IO",
    opponet_id: ""
};
socket.on("connect", event => reply(Events.WEBSOCKET_READY, { system: config.type }));
socket.on("connect_error", (event) => errorReply("connect_error", event));
socket.on("connect_timeout", (event) => errorReply("connect_timeout", event));
socket.on("reconnect", (event) => { });
socket.on("disconnect", event => errorReply(Events.SOCKET_DISCONNECT, { error: event }));
socket.on("opponent_init", (data) => {
    if (data.id !== socket.id) {
        reply(Events.INIT, data.data);
        config.opponet_id = data.id;
    }
});
socket.on(Events.STATUS_OPPONENT, data => reply(Events.STATUS_OPPONENT, data));
socket.on(Events.KICK, (data) => {
    if (data.user === socket.id) {
        reply(Events.KICK, { reason: "N/A" });
        socket.emit("self_kicked", { room: config.uuid });
        config.uuid = null;
    }
});
socket.on(Events.GAME_START, options => reply(Events.GAME_START, options));
socket.on(Events.NEW_GAME, (data) => {
    config.uuid = data.room;
    reply(Events.JOIN_CODE, { uuid: data.room });
});
coreHandler.addListener(Events.JOIN_GAME, (code) => {
    config.uuid = code.uuid;
    socket.emit(Events.JOIN_GAME, { uuid: config.uuid, id: socket.id });
    reply(Events.JOIN_CODE, { uuid: config.uuid });
});
coreHandler.addListener(Events.NEW_GAME, () => {
    socket.emit(Events.NEW_GAME, { restrict: false });
});
coreHandler.addListener(Events.INIT, (event) => {
    socket.emit(Events.INIT, { data: event, id: socket.id, room: config.uuid });
});
coreHandler.addListener(Events.KICK, () => {
    socket.emit(Events.KICK, { user: config.opponet_id, room: config.uuid });
});
coreHandler.addListener(Events.GAME_START, () => {
    socket.emit(Events.GAME_START, { room: config.uuid });
});
coreHandler.addListener(Events.STATUS_OPPONENT, (event) => {
    socket.emit(Events.STATUS_OPPONENT, { id: socket.id, room: config.uuid, status: event.status });
});
coreHandler.addListener(Events.JOIN_CODE, () => {
    reply(Events.JOIN_CODE, { uuid: config.uuid });
});
socket.on(Events.REQUEST_DECK, (data) => {
    reply(Events.REQUEST_DECK, { deck: data.deck });
});
socket.on(Events.SEND_DECK, () => {
    reply(Events.SEND_DECK, {});
});
coreHandler.addListener(Events.SEND_DECK, (data) => {
    socket.emit(Events.SEND_DECK, { room: config.uuid, id: socket.id, deck: data.deck });
});
coreHandler.addListener(Events.REQUEST_DECK, () => {
    socket.emit(Events.REQUEST_DECK, { room: config.uuid, of: config.opponet_id });
});
coreHandler.addListener(Events.READY, (event) => { });
coreHandler.addListener(Events.TURN_CHANGE, (event) => { });
