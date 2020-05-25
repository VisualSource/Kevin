import {routeTo} from '../../utils/history';
let instance: any = null;
export default class QueryableWorker implements KevinOnline.QueryableWorker{
    static getInstance(): QueryableWorker{
        if(instance == null){
          //instance = new QueryableWorker();
          routeTo("/play",{});
          console.error("No Vaild Worker Instance");
          
        }
        return instance;
    }
    static create(type: "singleplayer" | "multiplayer" = "singleplayer"): QueryableWorker{
        if(instance === null){
            instance = new QueryableWorker(type === "singleplayer" ? "/workers/AIOpponentWorker.js" : "/workers/OnlineOpponetWorker.js");
            return instance;
        }else{
            instance.terminate();
            instance = null;
            return QueryableWorker.create(type);
        }
    }
    static kill(): void{
        if(instance !== null){
            instance.terminate();
            instance = null;
        }
    }
    workerInstance: Worker;
    listeners: {[name: string]: Function} = {}
    constructor(url: string){
        this.workerInstance = new Worker(url);
        this.workerInstance.onerror = this.onError.bind(this);
        this.workerInstance.onmessage = this.onMessage.bind(this);
    }
    onMessage(event: MessageEvent){
        if(event.data.hasOwnProperty('name')){
            if(this.listeners[event.data.name]){
                this.listeners[event.data.name].apply(undefined,event.data.data);
            }else{
                console.log(event);
            }
        }
    }
    onError(error: ErrorEvent){
        console.error(error);
    }
    /*
        data needs to be a object
    */
    send(name: string, data: any): this{
        this.workerInstance.postMessage({
            name,
            data: [data]
        });
        return this;
    }
    terminate(): this{
        this.workerInstance.terminate();
        return this;
    }
    addListeners(name: string, listener: Function): this{
        this.listeners[name] = listener;
        return this;
    }
    removeAllListeners(): this{
        this.listeners = {};
        return this;
    }
    removeListeners(name: string): this{
        delete this.listeners[name];
        return this;
    }
}