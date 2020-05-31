import {GameObjects} from 'phaser';
import DropZone from './DropZone';
/**
 * Class for handling the dropzones and deletion and creation of cards on board
 *
 * @export
 * @class BoardObject
 * @extends {GameObjects.Group}
 */
export default class BoardObject extends GameObjects.Group implements KevinOnline.Objects.BoardObject {
    /**
     * The owner of the card
     * @type {KevinOnline.Owner}
     * @memberof BoardObject
     */
    owner: KevinOnline.Owner;
    /**
     * Object holding where the graveyard should be.
     * @type {KevinOnline.IPosistion}
     * @memberof BoardObject
     */
    graveyard: KevinOnline.IPosistion
    /**
     *Creates an instance of BoardObject.
     * @param {KevinOnline.Params.IBoard} {scene, owner, start, spacing, graveyard}
     * @memberof BoardObject
     */
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
    /**
     * Returns all unactive dropzones.
     *
     * @returns {DropZone[]}
     * @memberof BoardObject
     */
    unactiveSpots(): DropZone[]{
        return this.getChildren().filter(data=>data.getData("active") === false) as DropZone[];
    }
    /**
     * Returns all active dropzones.
     *
     * @returns {DropZone[]}
     * @memberof BoardObject
     */
    activeSpots(): DropZone[]{
        return this.getChildren().filter(data=>data.getData("active") === true) as DropZone[];
    }
    /**
     * Gets the dropzone with the the given id.
     *
     * @param {number} id
     * @returns {DropZone}
     * @memberof BoardObject
     */
    getSlot(id: number): DropZone{
        return this.getChildren().find(dat=>(dat as DropZone).id === id) as DropZone;
    }
    /**
     * Spawn a card a given dropzone and a set number of cards to create. 
     *  Good for duplcating cards
     *
     * @param {{card_id: number,zone_id:number,amount:number}} {card_id, zone_id, amount = 1}
     * @memberof BoardObject
     */
    spawn({card_id, zone_id, amount = 1}:{card_id: number,zone_id:number,amount:number}): this{
        const slots = this.getChildren();
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
        return this;
    }
   
}


