import {WEBGL, Game, Scale, Scene} from 'phaser';
import EventDispatcher from '../../game/utils/EventDispatcher';
import CardJson from '../../game/utils/Loader';
export const event = new EventDispatcher();
class ViewerScene extends Scene{
    card: Phaser.GameObjects.Sprite| null = null;
    flipTween: Phaser.Tweens.Tween | null = null;
    flipBackTween: Phaser.Tweens.Tween | null = null;
    screenX: number = 280 * 2;
    screenY: number = 200 * 2;
    backTexture: string = "default";
    frontTexture: string = "pyro_kevin";
    constructor(){
        super("Viwer");
        event.on("restart",(data: KevinOnline.CardData)=>{
          this.frontTexture = data.visual.front_texture;
          this.backTexture = data.visual.back_texture; 
          this.scene.restart();
        });
    }
    preload(){
        const front = CardJson.getInstance().resources?.assets.find(value=> value.name === this.frontTexture );
        const back = CardJson.getInstance().resources?.assets.find(value=> value.name === this.backTexture );
        this.load.image(this.frontTexture,front?.texture ?? "pyro_kevin.webp");
        this.load.image(this.backTexture,back?.texture ?? "default_backing.webp");
    }
    create(){
        let {width, height} = this.sys.game.canvas;
        this.card = this.add.sprite(width/2,height/2, this.frontTexture);
        this.card.setInteractive().setData("isFlipping",false).setDisplaySize(this.screenX,this.screenY);
        this.card.on('pointerdown', (pointer: any) => {
            if (!this.card?.getData("isFlipping")) {
                this.card?.setData("isFlipping" ,true);
                this.flipTween?.play();
            }else{
                this.flipBackTween?.play();
            }
            });
        this.flipTween = this.tweens.create({
            targets: this.card,
            scaleY: 0.2,
            caleX: 0,
            duration: 200,
            ease: 'Linear'
        });
        this.flipTween.on('complete', () => {
            this.card?.setTexture(this.backTexture).setDisplaySize(this.screenX,this.screenY);;
        });
        this.flipBackTween = this.tweens.create({
            targets: this.card,
            scaleY: 1,
            scaleX: 1,
            duration: 200,
            ease: 'Linear'
        });
        this.flipBackTween.on('complete', () => {
            this.card?.setTexture(this.frontTexture).setDisplaySize(this.screenX,this.screenY).setData("isFlipping",false);
        });
            

    }
}
class EditorViewer extends Game{
    constructor(canvas: HTMLCanvasElement){
        super({
            canvas,
            type: WEBGL,
            banner: false,
            backgroundColor: "#F1F8FE",
            title: "Viewer",
            scene: ViewerScene,
            scale: {
                mode: Scale.RESIZE,
            },
            physics:{
                //@ts-ignore
                default: false
            },
            version: "0.0.1",
            fps:{
                min: 30,
                target: 60
            },
            input: {
                keyboard: true,
                gamepad: false
            }
        });
    }
}
export function init(canvas: HTMLCanvasElement){
    const app = new EditorViewer(canvas);
    
}
   