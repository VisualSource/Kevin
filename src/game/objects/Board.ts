import {GameObjects} from 'phaser';
import DropZone from './DropZone';
import BoardCard from '../objects/cards/boardCard';
export default class BoardObject extends GameObjects.Group{
    owner: KevinOnline.Owner;
    graveyard: KevinOnline.IPosistion
    constructor({scene, owner, start, spacing, graveyard}:KevinOnline.Params.IBoard){
        super(scene);
        this.owner = owner;
        this.graveyard = graveyard
        const items: DropZone[] = [];
        for(let i = 0; i<6; i++){
            items.push(new DropZone({ 
                scene,
                posistion: {x: start.x + spacing, y: start.y},
                owner,
                id: i,
                graveyard
             }));
             start.x += spacing;
        }
        this.addMultiple(items);
        this.scene.add.existing(this);
    }
    activeSpots(){
        return this.getChildren().filter(data=>data.getData("active") === false);
    }
    getSlot(id: number){
        return this.getChildren().find(dat=>(dat as DropZone).id === id);
    }
    spawn({card_id, zone_id, amount = 1}:{card_id: number,zone_id:number,amount:number}){
        const slots = this.getChildren()
        let check = 1;
        const getAviableSlot = (): DropZone | null => {
            const a = slots[zone_id + check];
            const b = slots[zone_id - check];
            if(a !== undefined && !a.getData("active")){
                a.setData("active",true);
                check = 1;
                return a as DropZone;
            }else if(b !== undefined && !b.getData("active")){
                b.setData("active",true);
                check = 1;
                return b as DropZone;
            }else{
                if(check < slots.length){
                    check++;
                    return getAviableSlot();
                }else{
                    check = 1;
                    return null;
                }
            }
        }
        for (let i = 0; i < amount; i++) {
            const zone = getAviableSlot();
            if(zone !== null){
                const card = (this.scene as KevinOnline.Objects.MainGameScene).newCard(this.owner,zone,card_id, false);
                card.owner = zone.getData("owner");
                card.actionPoints = 0;
            }else{
                console.error("No space on board");
            }
        }
    }
   
}


