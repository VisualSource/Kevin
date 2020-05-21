import {GameObjects} from 'phaser';
import CardJson from '../../utils/Loader';
export default class dragableCard extends GameObjects.Sprite implements KevinOnline.Objects.DragableCard{
    handPosition = {
      transialtion:{x:0,y:0}, 
      angle: 0
    }
    cardData: KevinOnline.CardData;
    ogDepth: number = 0;
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
    reset(){
      this.setAngle(this.handPosition.angle).setDepth(this.ogDepth).setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y);
    }

    view(){
      this.ogDepth = this.depth;
      this.setAngle(0).setDepth(5).setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y-100);
    }

}