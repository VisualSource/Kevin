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
eventHandler.addListener("init", (event) => { 
    Core.reply("init", {name: "AI (Auzl)", status: "Ready", logo: "https://avatars1.githubusercontent.com/u/43074703?s=460&u=dee105f7822e6e3434ae46897889a0802fbc68cc&v=4"})
});
eventHandler.addListener("status_opponent",(event)=>{
    console.log(event);
});

