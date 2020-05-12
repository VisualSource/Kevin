import {Events} from 'phaser';
let instance: any = null;
export default class EventDispatcher extends Events.EventEmitter{
  static getInstance(): EventDispatcher{
    if(instance == null){
      instance = new EventDispatcher();
    }
    return instance;
  }
  constructor(){
    super();
  }
}

