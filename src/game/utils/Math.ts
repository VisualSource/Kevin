export function clamp(min: number, max:number, val: number): number{
    return Math.min(Math.max(min, val), max)
}
export function lerp(X: number, Y:number, t: number): number{
    return X*t + Y*(1-t)
}
export function select(a: any, b: any, index: boolean): any{
    if(index){
        return b;
    }else{
        return a;
    }
}

export function RandomNumber(max: number): number{
    return Math.floor(Math.random() * max);
}