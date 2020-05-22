import {Time} from 'phaser'
interface TimerParams{
    totalTime?: number;
    callback?: (time: string, timeup: boolean) => void;
}
export default class Timer {
    private startTime: Date = new Date();
    private timeElapsed: number = 0;
    private totalTime: number
    private callback: Function;
    constructor({totalTime = 120 ,callback = ()=>{}}:TimerParams){
        this.totalTime = totalTime;
        this.callback = callback;
    }
    
    updateTimer(){
        
        const currentTime = new Date();
        const timeDifference = this.startTime.getTime() - currentTime.getTime();
        this.timeElapsed = Math.abs(timeDifference/1000);

        const minutes = Math.floor(this.timeElapsed/60);
        const seconds = Math.floor(this.timeElapsed) - (60 * minutes);

        let result = (minutes < 10) ? `0${minutes}` : minutes.toString();

        result += (seconds < 10) ? `:0${seconds}` : `:${seconds}`;
        const over = this.timeElapsed >= this.totalTime;
        this.callback(result, over);
    }
}