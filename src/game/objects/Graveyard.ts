import {GameObjects, Scene} from 'phaser';
import {JsonLoader} from '@visualsource/vs_api';
export default class Graveyard extends GameObjects.Group{
    cardList: number[] = [];
    graveyard_location: KevinOnline.IPosistion = {x:0,y:0};
    constructor(scene: Scene, graveyard: KevinOnline.IPosistion){
        super(scene);
        this.graveyard_location = graveyard;
        this.scene.add.existing(this);
    }
    /**
     * Adds a new card to the graveyard, set new card as visual
     *
     * @param {number} index card index
     * @param {number} dz_id dropzone id
     * @param {KevinOnline.Owner} owner
     * @memberof Graveyard
     */
    addCard(index: number, dz_id: number, owner: KevinOnline.Owner): this{
        this.getChildren()[0]?.destroy();
        const data = JsonLoader.getInst().data?.cards[index] as KevinOnline.CardData;
        const visual = this.scene.add.sprite(this.graveyard_location.x,this.graveyard_location.y,data.visual.front_texture);
        visual.setDisplaySize(data.deck_settings.screen_size.x,data.deck_settings.screen_size.y);
        this.add(visual);
        if(owner === "self"){
           const dz = (this.scene as KevinOnline.Objects.MainGameScene).player_1_board.getSlot(dz_id);
           (dz as KevinOnline.Objects.DropZone).setData("active",false);
        }else{
            const dz = (this.scene as KevinOnline.Objects.MainGameScene).player_2_board.getSlot(dz_id);
            (dz as KevinOnline.Objects.DropZone).setData("active",false);
        }
        this.cardList.push(index);
        return this;
    }
    getTopCard(): number{
        const card = this.cardList[0];
        this.cardList = this.cardList.slice(0,0);
        return card; 
    }
    addCardToBoard(owner: KevinOnline.Owner){
        if(owner === "self"){
            (this.scene as KevinOnline.Objects.MainGameScene).spawnCard("self", this.getTopCard(),3);
        }else{
            (this.scene as KevinOnline.Objects.MainGameScene).spawnCard("opponent", this.getTopCard(),3);
        }
    }
    addCardToHand(owner: KevinOnline.Owner){
        if(owner === "self"){
            (this.scene as KevinOnline.Objects.MainGameScene).player_hand.addCardById(this.getTopCard());
        }else{
            (this.scene as KevinOnline.Objects.MainGameScene).opponent_hand.addCardById(this.getTopCard());
        }
    }

}