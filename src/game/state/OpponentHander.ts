
let instance: any = null;
export default class QueryableWorker{
    static getInstance(url?: string): QueryableWorker{
        if(instance == null && url){
          instance = new QueryableWorker(url as string);
        }
        return instance;
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
    onError(error: any){
        console.error(error);
    }
    /*
        data needs to be a object
    */
    send(name: string, data: any){
        this.workerInstance.postMessage({
            name,
            data: [data]
        });
    }
    terminate(){
        this.workerInstance.terminate();
    }
    addListeners(name: string, listener: Function){
        this.listeners[name] = listener;
    }
    removeListeners(name: string){
        delete this.listeners[name];
    }
}