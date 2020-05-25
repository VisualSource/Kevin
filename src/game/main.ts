import {Types, WEBGL, Game, Scale} from 'phaser';
import {queryFromURI} from '../utils/history';
import LoadingScene from './scenes/loadingScene';
import MainScene from './scenes/mainScene';
//import SceneWatcherPlugin from 'phaser-plugin-scene-watcher';
//i//mport PhaserUpdatePlugin from 'phaser-plugin-update';
function createConfig(canvas: HTMLCanvasElement): Types.Core.GameConfig{
    return {
        canvas,
        type: WEBGL,
        width: window.innerWidth,
        height: window.innerHeight,
        banner: false,
        title: "Kevin Online",
        scene: undefined,
        scale: {
            mode: Scale.RESIZE,
            autoCenter: Scale.NO_CENTER
        },
        physics:{
            //@ts-ignore
            default: false
        },
        version: "0.0.5-alpha-r2",
        fps:{
            min: 30,
            target: 60
        },
        input: {
            keyboard: true,
            gamepad: false
        },
        plugins:{
            global:[
              //  { key: 'SceneWatcher', plugin: SceneWatcherPlugin, start: true }
            ],
            scene:[
               // { key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates'},
            ]
        }
    
    }
}

class KevinOnline extends Game{
    settings: {uuid: string, online: boolean} = queryFromURI();
    constructor(config: Types.Core.GameConfig){
        super(config);
        this.scene.add("loading",LoadingScene, true,{settings: this.settings});
        this.scene.add("main",MainScene, false,{settings: this.settings});
    }
}
export function init(canvas: HTMLCanvasElement){
        const game = new KevinOnline(createConfig(canvas));
}