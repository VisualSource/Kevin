import {Scene} from 'phaser';
import dragableCard from '../objects/cards/dragableCard';
import BoardCard from '../objects/cards/boardCard';
import CardGroup from '../objects/cards/CardGroup';
import Hand from '../objects/Hand';
import BoardObject from '../objects/Board';
import GameState from '../state/GameState';
import {CardDeckMannager} from '../utils/Loader';
export default class GameScene extends Scene implements KevinOnline.Objects.MainGameScene{
    settings: KevinOnline.Settings = { uuid: "", online: false}
    gameState = GameState.getInstance();
    cardManager = CardDeckMannager.getInstance();
    player_1_board: any;
    player_2_board: any;
    player_hand: any;
    player_1_board_c: any;
    player_2_board_c: any;
    constructor(){
        super("main");
    }
    init(data: any){
        this.settings.uuid = data.settings.uuid;
        this.settings.online = data.settings.online as any === "true" ? true : false;
    }
    preload(){}
    create(){
        this.player_hand = new Hand({
            scene: this, 
            children: [
                new dragableCard({scene: this, id:0}),
                new dragableCard({scene: this, id:0}),
                new dragableCard({scene: this, id:0}),
                new dragableCard({scene: this, id:0})
            ]
        });
        this.player_1_board = new BoardObject({ 
            scene: this, 
            owner: "self", 
            start: {
                x: 75, 
                y: 600
            }, 
            spacing: 225,
            graveyard: {
                x: 300 + 1400,
                y: 600
            } 
        });
        this.player_1_board_c = new CardGroup({scene: this});
        this.player_2_board = new BoardObject({
            scene: this, 
            owner: "opponent", 
            start: {
                x: 75, 
                y: 300
            }, 
            spacing: 225,
            graveyard: {
                x: 0,
                y: 300
            }
        });
        this.player_2_board_c = new CardGroup({scene: this});
        this.input.on('drag', function (pointer: any, gameObject: KevinOnline.Objects.DragableCard) {
            gameObject.setAngle(0);
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
        });
        this.input.on('dragend', function (pointer: any, gameObject:KevinOnline.Objects.DragableCard) {
            gameObject.setPosition(gameObject.handPosition.transialtion.x,gameObject.handPosition.transialtion.y);
            gameObject.setAngle(gameObject.handPosition.angle);
        });
       this.input.on('drop',  (pointer: any, gameObject: KevinOnline.Objects.DragableCard, dropZone: KevinOnline.Objects.DropZone)=>{
           if(gameObject.cardData.placement_settings.mana_cost <= this.gameState.selfProxy.mana && !dropZone.getData("active") && (dropZone.getData("owner") === gameObject.cardData.placement_settings.owner || gameObject.cardData.placement_settings.owner === "self_and_opponent")){
                this.gameState.selfProxy.mana -= gameObject.cardData.placement_settings.mana_cost;
                this.newCard(dropZone.getData("owner") as KevinOnline.Owner,dropZone,gameObject.cardData.index)
                this.player_hand.removeCard(gameObject);
            }
        });
    }
    newCard(owner: KevinOnline.Owner, dropZone: KevinOnline.Objects.DropZone, card_id: number, active: boolean = true): KevinOnline.Objects.BoardCard{
        switch (owner) {
            case "self":{
               return (this.player_1_board_c as CardGroup).addCard(dropZone,card_id, active);
            }
            case "opponent":{
                return (this.player_2_board_c as CardGroup).addCard(dropZone,card_id, active);
            }
        }
    }
    spawnCard(owner: KevinOnline.Owner, card_id:number, zone_id:number, amount: number = 1){
        switch (owner) {
            case "opponent":{
                this.player_2_board.spawn({card_id, zone_id, amount});
                break;
            }
            case "self":{
                this.player_1_board.spawn({card_id, zone_id, amount});
                break;
            }
            default:
                console.error("Owner setting not supported");
                break;
        }
    }
}