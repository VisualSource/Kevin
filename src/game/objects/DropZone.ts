import {GameObjects} from 'phaser';
import EventDispatcher from '../utils/EventDispatcher';
export default class DropZone extends GameObjects.Zone implements KevinOnline.Objects.DropZone{
    emiter = EventDispatcher.getInstance();
    id: number;
    graveyard: KevinOnline.IPosistion;
    constructor({scene, posistion, owner, id, graveyard}:KevinOnline.Params.IDropZone){
        super(scene,posistion.x,posistion.y, 200,280);
        this.graveyard = graveyard;
        this.id = id;
        this.setRectangleDropZone(200,280);
        this.setData("owner",owner);
        this.setData("active",false);
        scene.add.existing(this);
        scene.input.enableDebug(this);
        this.emiter.on("empty",(data: any)=>{
            if(data.id === this.id){

            }
        });
    }
}