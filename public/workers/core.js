(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = global || self, factory(global.Core = {}));
}(this, (function (exports) { 'use strict';

   (function (Events) {
       Events["REQUEST_DECK"] = "request_deck";
       Events["READY"] = "ready";
       Events["TURN_CHANGE"] = "turn_change";
       Events["KICK"] = "kick";
       Events["GAME_START"] = "game_start";
       Events["JOIN_CODE"] = "join_code";
       Events["AI_DIFFICLTY"] = "ai_difficlty";
       Events["INIT"] = "init";
       Events["STATUS_OPPONENT"] = "status_opponent";
   })(exports.Events || (exports.Events = {}));
   /**
    * A Class to hand event send from the main thread.
    *
    * @class EventHandler
    */
   class EventHandler {
       constructor() {
           this.listeners = {};
       }
       addListener(name, callback) {
           this.listeners[name] = callback;
           return this;
       }
       removeListener(name) {
           delete this.listeners[name];
           return this;
       }
       emit(name, args) {
           this.listeners[name].apply(undefined, args);
           return this;
       }
   }
   /**
    * A function to handle the replying to the main thread
    *
    * @param {Events} name
    * @param {any} data
    */
   function reply(name, data) {
       postMessage({ name, data: [data] });
   }

   exports.EventHandler = EventHandler;
   exports.reply = reply;

   Object.defineProperty(exports, '__esModule', { value: true });

})));
