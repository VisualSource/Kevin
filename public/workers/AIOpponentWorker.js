importScripts("./core.js", "./yuka.min.js");
var Events = Core.Events, EventHandler = Core.EventHandler, reply = Core.reply;
var eventHandler = new EventHandler();
self.onmessage = function (event) { return eventHandler.emit(event.data.name, event.data.data); };
var deck = [{ id: 0, ammount: 3 }];
var ai_config = {
    uuid: YUKA.MathUtils.generateUUID(),
    health: 30,
    difficlty: "Normal",
    name: "AI (Auzl)",
    logo: "https://avatars1.githubusercontent.com/u/43074703?s=460&u=dee105f7822e6e3434ae46897889a0802fbc68cc&v=4",
    status: "Ready",
    type: "YUKA"
};
reply(Events.WEBSOCKET_READY, { system: ai_config.type });
eventHandler.addListener(Events.REQUEST_DECK, function () {
    reply(Events.REQUEST_DECK, { deck: deck, id: ai_config.uuid });
});
eventHandler.addListener(Events.READY, function (event) {
});
eventHandler.addListener(Events.TURN_CHANGE, function (event) {
    console.log("Turn Change", event);
    setTimeout(function () {
        reply(Events.TURN_CHANGE, {});
    }, 1000);
});
eventHandler.addListener(Events.GAME_START, function () { });
eventHandler.addListener(Events.KICK, function () {
    reply(Events.KICK, {});
});
eventHandler.addListener(Events.JOIN_CODE, function (event) {
    console.log(event);
    reply(Events.JOIN_CODE, { uuid: YUKA.MathUtils.generateUUID() });
});
eventHandler.addListener(Events.AI_DIFFICLTY, function (event) {
    ai_config.difficlty = event;
    console.log("Event: ai_difficlty, Set Ai difficlty to: ", event);
});
eventHandler.addListener(Events.INIT, function (event) {
    reply(Events.INIT, { name: ai_config.name, status: ai_config.status, logo: ai_config.logo });
});
eventHandler.addListener(Events.STATUS_OPPONENT, function (event) {
    console.log("Event: status_opponent", event);
});
