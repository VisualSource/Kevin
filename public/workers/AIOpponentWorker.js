importScripts("./core.js", "./yuka.min.js");
const { Events, EventHandler, reply } = Core;
const eventHandler = new EventHandler();
self.onmessage = (event) => { eventHandler.emit(event.data.name, event.data.data); };
const deck = [{ id: 0, ammount: 3 }];
const ai_config = {
    uuid: YUKA.MathUtils.generateUUID(),
    health: 30,
    difficlty: "Normal",
    name: "AI (Auzl)",
    logo: "https://avatars1.githubusercontent.com/u/43074703?s=460&u=dee105f7822e6e3434ae46897889a0802fbc68cc&v=4",
    status: "Ready"
};
eventHandler.addListener(Events.REQUEST_DECK, () => {
    reply(Events.REQUEST_DECK, { deck, id: ai_config.uuid });
});
eventHandler.addListener(Events.READY, (event) => {
    reply("installed", { installed: typeof YUKA === "object" ? "YUKA" : "none" });
});
eventHandler.addListener(Events.TURN_CHANGE, (event) => {
    console.log("Turn Change", event);
    setTimeout(() => {
        reply(Events.TURN_CHANGE, {});
    }, 1000);
});
eventHandler.addListener(Events.GAME_START, () => { });
eventHandler.addListener(Events.KICK, () => {
    reply(Events.KICK, {});
});
eventHandler.addListener(Events.JOIN_CODE, (event) => {
    console.log(event);
    reply(Events.JOIN_CODE, { uuid: YUKA.MathUtils.generateUUID() });
});
eventHandler.addListener(Events.AI_DIFFICLTY, (event) => {
    ai_config.difficlty = event;
    console.log("Event: ai_difficlty, Set Ai difficlty to: ", event);
});
eventHandler.addListener(Events.INIT, (event) => {
    reply(Events.INIT, { name: ai_config.name, status: ai_config.status, logo: ai_config.logo });
});
eventHandler.addListener(Events.STATUS_OPPONENT, (event) => {
    console.log("Event: status_opponent", event);
});
