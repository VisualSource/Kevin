import {GameObjects} from 'phaser';
import CardJson from '../../utils/Loader';
/**
 * The main object of the the interactible card that is used for placing on the board and is used in the Hand Class
 *
 * @export
 * @class dragableCard
 * @extends {GameObjects.Sprite}
 * @implements {KevinOnline.Objects.DragableCard}
 */
export default class dragableCard extends GameObjects.Sprite implements KevinOnline.Objects.DragableCard{
    /**
     * Object that holds the position in hand that the card is at.
     * @memberof dragableCard
     */
    handPosition = {
      transialtion:{x:0,y:0}, 
      angle: 0
    }
    /**
     * Object that holds all data about the card.
     * @type {KevinOnline.CardData}
     * @memberof dragableCard
     */
    cardData: KevinOnline.CardData;
    /**
     * The orginal depth of the card.
     * @type {number}
     * @memberof dragableCard
     */
    ogDepth: number = 0;
    /**
     * Creates an instance of dragableCard.
     * @param {KevinOnline.Params.IDragableCard} {scene, id, canInteract = true, hidden = false}
     * @memberof dragableCard
     */
    constructor({scene, id, canInteract = true, hidden = false}: KevinOnline.Params.IDragableCard){
        super(scene,0,0, !hidden ? (CardJson.getInstance().resources?.cards[id].visual.front_texture as string) : (CardJson.getInstance().resources?.cards[id].visual.back_texture as string));
        this.setInteractive();
        this.cardData = CardJson.getInstance().resources?.cards[id] as KevinOnline.CardData;
        this.setDisplaySize(this.cardData.deck_settings.screen_size.x,this.cardData.deck_settings.screen_size.y);
        
        if(canInteract){
          scene.input.setDraggable(this);
          this.on("pointerover",()=> {
            this.view()
          });
       
          this.on('pointerout', ()=>{
            this.reset();
          });
          this.on("dragstart",()=>{
            this.reset();
          });

        }
        scene.add.existing(this);
    
    }
    /**
     * Reset the angle, depth and position of card to orignal hand posistion
     *
     * @memberof dragableCard
     */
    reset(){
      this.setAngle(this.handPosition.angle).setDepth(this.ogDepth).setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y);
    }
    /**
     * A zoom effect to view card when in hand
     *
     * @memberof dragableCard
     */
    view(){
      this.ogDepth = this.depth;
      this.setAngle(0).setDepth(5).setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y-100);
    }

}