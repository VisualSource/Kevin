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
    const state = GameState.getInstance();
    switch (data.type) {
        case "draw_card":{
            // add opponent card draw
            for (let i = 0; i < data.ability_int; i++) {
                switch (data.affecting_player) {
                    case "opponent":
                        break;
                    case "self":{
                        sprite.GameScene.player_hand.drawCard("self");
                        break;
                    }
                    case "self_and_opponent":{
                        sprite.GameScene.player_hand.drawCard("self");
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
                        sprite.GameScene.player_hand.discardHand();
                       break;
                    case "self_and_opponent":{
                        sprite.GameScene.player_hand.discardHand();
                        break;
                    }
                   default:
                       break;
               }
              sprite.actionPoints--;
            break;
        }
        case "pickup_first_creature_in_graveyard_to_board":{
            sprite.actionPoints--;
            break;
        }
        case "pickup_first_creature_in_graveyard_to_hand":{
            sprite.actionPoints--;
              //effect hand
            break;
        }
        case "possess_opponents_card":{
            sprite.actionPoints--;
            break;
        }
        case "swap_cards_in_hand":{
            sprite.actionPoints--;
              //effect hand
            break;
        }
        default:
            console.log("Not implemented");
            break;
    }
}
export default class BoardCard extends GameObjects.Sprite implements KevinOnline.Objects.BoardCard{
    cardData: KevinOnline.CardData;
    emmiter: EventDispatcher;
    lifeSpan: number = 0;
    owner: KevinOnline.Owner = "self";
    attack: number;
    actionPoints: number = 1;
    constructor({scene, posistion,id, graveyard, dropzone_id}: KevinOnline.Params.IBoardCard){
        super(scene,posistion.x,posistion.y,CardJson.getInstance().resources?.cards[id].visual.front_texture as string);
        this.cardData = CardJson.getInstance().resources?.cards[id] as KevinOnline.CardData;
        this.emmiter = EventDispatcher.getInstance();
        this.setData("dropzone_id",dropzone_id);
        this.attack = this.cardData.attack.damage;
        CreateAblites(this.cardData.abilities,this);
        this.setDisplaySize(this.cardData.deck_settings.screen_size.x,this.cardData.deck_settings.screen_size.y);
        PhaserHealth.AddTo(this, this.cardData.health.health, this.cardData.health.health);
        scene.add.existing(this);
        this.init();
        this.on("die",(spr: BoardCard)=>{
            this.emit("sent_to_graveyard");//emit for ablity
            if(spr.cardData.health.sound_cue_death !== ""){
                spr.scene.sound.play(spr.cardData.health.sound_cue_death);
            }
            if(spr.cardData.health.death_particle !== ""){}
            spr.setPosition(graveyard.x,graveyard.y);
            spr.setActive(false);
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
        this.emit("takes_damage", {card_index: index, owner});//emit for ablity
    }
    get GameScene(){
        return this.scene as KevinOnline.Objects.MainGameScene;
    }
    

}