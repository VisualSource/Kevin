importScripts("./core.js", "./yuka.min.js");
const eventHandler = new Core.EventHandler();
const deck = [{ id: 0, ammount: 3 }];
const ai_config = {
    uuid: YUKA.MathUtils.generateUUID(),
    health: 30,
    difficlty: "Normal",
    name: "AI (Auzl)",
    logo: "https://avatars1.githubusercontent.com/u/43074703?s=460&u=dee105f7822e6e3434ae46897889a0802fbc68cc&v=4",
    status: "Ready"
};
self.onmessage = (event) => { eventHandler.emit(event.data.name, event.data.data); };
eventHandler.addListener("request_deck", () => {
    Core.reply("request_deck", { deck, id: ai_config.uuid });
});
eventHandler.addListener("ready", (event) => {
    Core.reply("installed", { installed: typeof YUKA === "object" ? "YUKA" : "none" });
});


eventHandler.addListener("turn_change",(event)=>{
    console.log("Turn Change", event);
    Core.reply("turn_change",{});
});

eventHandler.addListener("game_start",()=>{});
eventHandler.addListener("kick",()=>{
    Core.reply("kick",{});
});
eventHandler.addListener("join_code",(event)=>{
    console.log(event);
    Core.reply("join_code",{uuid: YUKA.MathUtils.generateUUID()});
});
eventHandler.addListener("ai_difficlty",(event)=>{
    ai_config.difficlty = event;
    console.log("Event: ai_difficlty, Set Ai difficlty to: ", event);
});
eventHandler.addListener("init", (event) => { 
    Core.reply("init", {name: ai_config.name, status: ai_config.status, logo: ai_config.logo});
});
eventHandler.addListener("status_opponent",(event)=>{
    console.log("Event: status_opponent", event);
});

