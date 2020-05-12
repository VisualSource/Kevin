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
                dropzone_id: dropzone.id
            });
            this.add(card);
            if(setActive) dropzone.setData("active", true);
            return card;
    }
}