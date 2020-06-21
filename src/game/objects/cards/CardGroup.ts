import {GameObjects} from 'phaser';
import BoardCard from './boardCard';

export default class CardGroup extends GameObjects.Group implements KevinOnline.Objects.CardGroup{
    constructor({scene}: KevinOnline.Params.ICardGroup){
        super(scene);
        this.scene.add.existing(this);
    }
    addCard(dropzone: KevinOnline.Objects.DropZone, index: number, setActive: boolean = true): BoardCard{
            const card = new BoardCard({
                scene: this.scene,
                posistion: {
                    x: dropzone.x,
                    y: dropzone.y
                },
                id: index,
                graveyard: dropzone.graveyard,
                dropzone_id: dropzone.id,
                owner: dropzone.getData("owner")
            });
            this.add(card);
            if(setActive) dropzone.setData("active", true);
            return card;
    }
    getCardByDropZone(id: number): BoardCard{
        return this.getChildren().find((value=>value.getData("dropzone_id") === id)) as BoardCard;
    }
    removeCard(card: BoardCard){
        if(card.owner === "self"){
            const zone = ((this.scene as KevinOnline.Objects.MainGameScene).player_1_board as KevinOnline.Objects.BoardObject).getSlot(card.getData("dropzone_id")) as KevinOnline.Objects.DropZone;
            zone.setData("active",false);
        }else{
            const zone = ((this.scene as KevinOnline.Objects.MainGameScene).player_2_board as KevinOnline.Objects.BoardObject).getSlot(card.getData("dropzone_id")) as KevinOnline.Objects.DropZone;
            zone.setData("active",false);
        }
        this.remove(card, true, true);

    }
}