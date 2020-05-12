importScripts("./core.js", "./yuka.min.js");
const eventHandler = new Core.EventHandler();
const deck = [{ id: 0, ammount: 3 }];
const ai_config = {
    uuid: YUKA.MathUtils.generateUUID(),
    health: 30
};
self.onmessage = (event) => { eventHandler.emit(event.data.name, event.data.data); };
eventHandler.addListener("request_deck", () => {
    Core.reply("reply_deck", { deck, id: ai_config.uuid });
});
eventHandler.addListener("ready", (event) => {
    Core.reply("installed", { installed: typeof YUKA === "object" ? "YUKA" : "none" });
});
eventHandler.addListener("end_of_turn", (event) => { });
eventHandler.addListener("start_of_turn", () => { });
eventHandler.addListener("death", () => { });
eventHandler.addListener("win", () => { });
