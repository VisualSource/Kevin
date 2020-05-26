import {GameObjects} from 'phaser';
import CardJson,{CardDeckMannager} from '../../utils/Loader';
import PhaserHealth from 'phaser-component-health';
import EventDispatcher from '../../utils/EventDispatcher';
import GameState from '../../state/GameState';
function CreateAblites(data: KevinOnline.CardAbilities[], sprite: BoardCard){
   data.forEach(data=>{
    if(data.trigger !== "none"){
        sprite.on(data.trigger,(event: any)=>{
          if(sprite.active && sprite.actionPoints > 0) run(sprite,data, event);
        });
    }
   });
}
function run(sprite: BoardCard, data: KevinOnline.CardAbilities, event: any){
   if(data.after_use_state === "single_use_to_graveyard_before_ability") sprite.emit("single_use_send_to_graveyard_before_ability");
    const state = GameState.getInstance();
    switch (data.type) {
        case "draw_card":{
            // add opponent card draw
            for (let i = 0; i < data.ability_int; i++) {
                switch (data.affecting_player) {
                    case "opponent":
                        sprite.GameScene.opponent_hand.drawCard("opponent");
                        break;
                    case "self":{
                        sprite.GameScene.player_hand.drawCard("self");
                        break;
                    }
                    case "self_and_opponent":{
                        sprite.GameScene.player_hand.drawCard("self");
                        sprite.GameScene.opponent_hand.drawCard("opponent");
                        break;
                    }
                    default:
                        break;
                }
            }
            sprite.actionPoints--;
            break;
        }
        case "increase_attack":{
            sprite.attack += data.ability_int;
            sprite.actionPoints--;
            break;
        }
        case "clone":{
            sprite.GameScene.spawnCard(data.affecting_player,sprite.cardData.index,sprite.getData("dropzone_id"), data.ability_int);
            sprite.actionPoints--;
            break;
        }
        case "increase_player_health":{
           if(data.affecting_player === "self_and_opponent"){
            state.selfProxy.health += data.ability_int;
            state.oppoentProxy.health += data.ability_int;
           }else{
               state[data.affecting_player].proxy.health += data.ability_int;
           }
           sprite.actionPoints--;
            break;
        }
        case "retaliation_damage":{
            console.log(event);
            // works with "takes_damage only"
            sprite.actionPoints--;
            break;
        }
        case "damage_all_cards_on_board":{
            switch (data.affecting_player) {
                case "self":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card, i)=>{
                        (card as BoardCard).damageCard(data.ability_int, i, sprite.owner);
                    });
                    break;
                }
                case "opponent":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card, i)=>{
                        (card as BoardCard).damageCard(data.ability_int, i, sprite.owner);
                    });
                    break;
                }
                case "self_and_opponent":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card, i)=>{
                        (card as BoardCard).damageCard(data.ability_int, i, sprite.owner);
                    });
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card, i)=>{
                        (card as BoardCard).damageCard(data.ability_int, i, sprite.owner);
                    });
                    break;
                }
                default:
                    break;
            }
            sprite.actionPoints--;
            break;
        }
        case "spawn_card_from_deck":{
            sprite.GameScene.spawnCard(data.affecting_player,CardDeckMannager.getInstance().getRandomCard(data.affecting_player),sprite.getData("dropzone_id"), data.ability_int);
            sprite.actionPoints--;
            break;
        }
        case "give_turn_points_to_all_active_cards":{
            switch (data.affecting_player) {
                case "self":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card)=>{
                        (card as BoardCard).actionPoints += data.ability_int;
                    });
                    break;
                }
                case "opponent":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card)=>{
                        (card as BoardCard).actionPoints += data.ability_int;
                    });
                    break;
                }
                case "self_and_opponent":{
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card)=>{
                        (card as BoardCard).actionPoints += data.ability_int;
                    });
                    (sprite.GameScene.player_1_board_c as KevinOnline.Objects.CardGroup).getChildren().forEach((card)=>{
                        (card as BoardCard).actionPoints += data.ability_int;
                    });
                    break;
                }
                default:
                    break;
            }
            sprite.actionPoints--;
            break;
        }
        case "increase_turn_points":{
           sprite.actionPoints += data.ability_int;
           sprite.actionPoints--;
           break;
        }
        case "discard_cards_in_hand":{
            switch (data.affecting_player) {
                case "self":
                     sprite.GameScene.player_hand.discardCard(data.ability_int);
                    break;
                 case "self_and_opponent":{
                     sprite.GameScene.player_hand.discardCard(data.ability_int);
                     sprite.GameScene.opponent_hand.discardCard(data.ability_int);
                     break;
                 }
                 case "opponent":{
                     sprite.GameScene.opponent_hand.discardCard(data.ability_int);
                     break;
                 }
                default:
                    break;
            }
              sprite.actionPoints--;
            break;
        }
        case "pickup_first_creature_in_graveyard_to_board":{
            switch (data.affecting_player) {
                case "self":
                    sprite.GameScene.graveyard_a.addCardToBoard(data.affecting_player);
                    break;
                case "opponent":
                    sprite.GameScene.graveyard_b.addCardToBoard(data.affecting_player);
                    break;
                case "self_and_opponent":
                    sprite.GameScene.graveyard_a.addCardToBoard("self");
                    sprite.GameScene.graveyard_b.addCardToBoard("opponent");
                default:
                    break;
            }
            sprite.actionPoints--;
            break;
        }
        case "pickup_first_creature_in_graveyard_to_hand":{
            switch (data.affecting_player) {
                case "self":
                    sprite.GameScene.graveyard_a.addCardToHand(data.affecting_player);
                    break;
                case "opponent":
                    sprite.GameScene.graveyard_b.addCardToHand(data.affecting_player);
                    break;
                case "self_and_opponent":
                    sprite.GameScene.graveyard_a.addCardToHand(data.affecting_player);
                    sprite.GameScene.graveyard_b.addCardToHand(data.affecting_player);
                    break;
                default:
                    break;
            }
            sprite.actionPoints--;
            break;
        }
        case "possess_opponents_card":{
            const poss = sprite.GameScene.player_2_board.activeSpots()[0];
            console.log(poss);
            
            sprite.actionPoints--;
            break;
        }
        case "swap_cards_in_hand":{
            const scene = sprite.GameScene;
            const oh = scene.opponent_hand.getCardList();
            const uh = scene.player_hand.getCardList();
            scene.player_hand.discardAll();
            scene.opponent_hand.discardAll();
            oh.forEach(value=>{
                scene.player_hand.addCardById(value);
            });
            uh.forEach(value=>{
                scene.opponent_hand.addCardById(value, true, false);
            });
            sprite.actionPoints--;
            break;
        }
        default:
            console.log("Not implemented");
            break;
    }
    if(data.after_use_state === "single_use_to_graveyard_after_ability") sprite.emit("single_use_send_to_graveyard_after_ability");
}
//TODO when card moves to graveyard, set dropzone active to false;
export default class BoardCard extends GameObjects.Sprite implements KevinOnline.Objects.BoardCard{
    cardData: KevinOnline.CardData;
    emmiter: EventDispatcher;
    lifeSpan: number = 0;
    owner: KevinOnline.Owner = "self";
    attack: number;
    actionPoints: number = 1;
    graveyard: KevinOnline.IPosistion;
    constructor({scene, posistion,id, graveyard, dropzone_id}: KevinOnline.Params.IBoardCard){
        super(scene,posistion.x,posistion.y,CardJson.getInstance().resources?.cards[id].visual.front_texture as string);
        this.cardData = CardJson.getInstance().resources?.cards[id] as KevinOnline.CardData;
        this.graveyard = graveyard;
        this.emmiter = EventDispatcher.getInstance();
        this.setData("dropzone_id",dropzone_id);
        this.attack = this.cardData.attack.damage;
        CreateAblites(this.cardData.abilities,this);
        this.setDisplaySize(this.cardData.deck_settings.screen_size.x,this.cardData.deck_settings.screen_size.y);
        PhaserHealth.AddTo(this, this.cardData.health.health, this.cardData.health.health);
        scene.add.existing(this);
        this.init();
        this.on("single_use_send_to_graveyard_before_ability",()=>{
            this.toGraveyard();
        });
        this.on("single_use_send_to_graveyard_after_ability",()=>{
            this.toGraveyard();
        });
        this.on("die",()=>{
           this.toGraveyard();
        });
        this.on('healthchange', function (spr: BoardCard, amount: number, health: number, maxHealth: number) {
            // Health changed by ${amount}, now ${health}/${maxHealth}
        });
        this.emmiter.on("start_of_turn",(data: any)=>{
            if(data.owner === this.owner){
                this.emit("start_of_turn");//emit for ablity
                if(this.cardData.health.life_expectancy !== 0){
                    if(this.cardData.health.life_expectancy <= this.lifeSpan){
                        this.kill();
                        this.emit("death_by_life_expectancy");
                    }else{
                        this.lifeSpan++;
                    }
                }

            }
        });
       this.emmiter.on("end_of_turn",(data:any)=>{
           if(data.owner === this.owner){
            this.emit("end_of_turn");//emit for ablity
           }
       });
    }
    init(){
        //emit for ablity
        if(this.cardData.placement_settings.sound_cue_entry !== ""){
            this.scene.sound.play(this.cardData.placement_settings.sound_cue_entry);
        }
        if(this.cardData.placement_settings.entry_particle !== ""){}
        setTimeout(()=>{
            this.emit("on_drop");
        },1)
      
    }
    damageCard(damage: number, index:number, owner: KevinOnline.Owner){
        this.damage(damage);
        this.emit("takes_damage", {index, owner});//emit for ablity
    }
    get GameScene(){
        return this.scene as KevinOnline.Objects.MainGameScene;
    }
    toGraveyard(){
        this.emit("sent_to_graveyard");//emit for ablity
        if(this.cardData.health.sound_cue_death !== ""){
            this.scene.sound.play(this.cardData.health.sound_cue_death);
        }
        if(this.cardData.health.death_particle !== ""){}
        this.setActive(false);
        this.scene.tweens.add({
            targets: this,
            x: {from: this.x, to: this.graveyard.x},
            y: { from: this.y, to: this.graveyard.y},
            duration: 100,
            onComplete: ()=>{
               this.destroy();
            }
        });
        if(this.owner === "self"){
            (this.scene as KevinOnline.Objects.MainGameScene).graveyard_a.addCard(this.cardData.index, this.getData("dropzone_id"),this.owner);
        }else{
            (this.scene as KevinOnline.Objects.MainGameScene).graveyard_b.addCard(this.cardData.index, this.getData("dropzone_id"),this.owner);
        }
        //this.setPosition(this.graveyard.x,this.graveyard.y);;
    }
    

}