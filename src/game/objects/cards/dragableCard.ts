import {GameObjects} from 'phaser';
import CardJson from '../../utils/Loader';
export default class dragableCard extends GameObjects.Sprite implements KevinOnline.Objects.DragableCard{
    handPosition = {
      transialtion:{x:0,y:0}, 
      angle: 0
    }
    cardData: KevinOnline.CardData;
    constructor({scene, id}: KevinOnline.Params.IDragableCard){
        super(scene,0,0,CardJson.getInstance().resources?.cards[id].visual.front_texture as string);
        this.setInteractive();
  
        this.cardData = CardJson.getInstance().resources?.cards[id] as KevinOnline.CardData;
        this.setDisplaySize(this.cardData.deck_settings.screen_size.x,this.cardData.deck_settings.screen_size.y);
        scene.input.setDraggable(this);
        scene.add.existing(this);
        this.on("pointerover",()=> {
          this.view()
        });
     
        this.on('pointerout', ()=>{
          this.reset();
        });
        this.on("dragstart",()=>{
          this.reset();
        })
   
    
    }
    reset(){
      this.setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y);
      this.setAngle(this.handPosition.angle);
    }

    view(){
        this.setPosition(this.handPosition.transialtion.x,this.handPosition.transialtion.y-100);
        this.setAngle(0);
    }

}