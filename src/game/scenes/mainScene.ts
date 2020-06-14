import {Scene} from 'phaser';
import dragableCard from '../objects/cards/dragableCard';
import CardGroup from '../objects/cards/CardGroup';
import Graveyard from '../objects/Graveyard';
import Hand from '../objects/Hand';
import BoardObject from '../objects/Board';
import GameState from '../state/GameState';
import {CardDeckMannager} from '../utils/Loader';
import QueryableWorker from '../state/OpponentHander';


import PhaserGUIAction from 'phaser3_gui_inspector';
export default class GameScene extends Scene implements KevinOnline.Objects.MainGameScene{
    settings: KevinOnline.Settings = { uuid: "", online: false, debug: false}
    gameState = GameState.getInstance();
    cardManager = CardDeckMannager.getInstance();
    worker = QueryableWorker.getInstance();
    player_1_board: any;
    player_2_board: any;
    player_hand: any;
    opponent_hand: any;
    player_1_board_c: any;
    player_2_board_c: any;
    graveyard_a: any;
    graveyard_b: any;
    constructor(){
        super("main");
    }
    init(data: any){
        this.settings.uuid = data.settings.uuid;
        this.settings.online = data.settings.online as any === "true" ? true : false;
        if(this.settings.debug){
            PhaserGUIAction(this);
        }
    }
    preload(){
        this.gameState.OverlayProxy.show = true;
    }
    create(){
        const shader = this.add.shader("Stripes",0,0,50,50).setRenderToTexture("shader_stripes");
        this.graveyard_a = new Graveyard(this,{
            x: 300 + 1400,
            y: 600
        } );
        this.graveyard_b = new Graveyard(this,{
            x: 0,
            y: 300
        });
        this.opponent_hand = new Hand({
            scene: this,
            config: {
                card_scale: 1,
                rotation_distance_scale_factor: -0.15,
                radius_offset: 0.05,
                card_spacing: 250,
                screenOffestY: 5
            },
            children: [
                new dragableCard({scene: this, id:0, canInteract: false, hidden: true}),
                new dragableCard({scene: this, id:0, canInteract: false, hidden: true}),
                new dragableCard({scene: this, id:0, canInteract: false, hidden: true}),
                new dragableCard({scene: this, id:0, canInteract: false, hidden: true})
            ]
        });
        this.player_hand = new Hand({
            scene: this, 
            children: [
                new dragableCard({scene: this, id: this.cardManager.getRandomCard("self")}),
                new dragableCard({scene: this, id: this.cardManager.getRandomCard("self")}),
                new dragableCard({scene: this, id: this.cardManager.getRandomCard("self")}),
                new dragableCard({scene: this, id: this.cardManager.getRandomCard("self")})
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
        this.player_2_board_c.addCard(this.player_2_board.getSlot(0),1);
        this.player_2_board_c.addCard(this.player_2_board.getSlot(5),1);
        this.input.on('drag', function (pointer: any, gameObject: KevinOnline.Objects.DragableCard) {
            if(gameObject instanceof dragableCard){
                gameObject.setAngle(0);
                gameObject.x = pointer.x;
                gameObject.y = pointer.y;
            }
        });
        this.input.on('dragend', function (pointer: any, gameObject:KevinOnline.Objects.DragableCard) {
            if(gameObject instanceof dragableCard){
                gameObject.setPosition(gameObject.handPosition.transialtion.x,gameObject.handPosition.transialtion.y);
                gameObject.setAngle(gameObject.handPosition.angle);
            }
        });
       this.input.on('drop',  (pointer: any, gameObject: KevinOnline.Objects.DragableCard, dropZone: KevinOnline.Objects.DropZone)=>{
           if(gameObject instanceof dragableCard){
            if(gameObject.cardData.placement_settings.mana_cost <= this.gameState.selfProxy.mana && 
                !dropZone.getData("active") && 
                (dropZone.getData("owner") === gameObject.cardData.placement_settings.owner || gameObject.cardData.placement_settings.owner === "self_and_opponent")){
                  this.gameState.selfProxy.mana -= gameObject.cardData.placement_settings.mana_cost;
                  this.newCard(dropZone.getData("owner") as KevinOnline.Owner,dropZone,gameObject.cardData.index)
                  this.player_hand.removeCard(gameObject);
              }
           }
        });
    
    }
    /**
     * Creates a new card at a given dropzone
     *
     * @param {KevinOnline.Owner} owner
     * @param {KevinOnline.Objects.DropZone} dropZone
     * @param {number} card_id
     * @param {boolean} [active=true]
     * @returns {KevinOnline.Objects.BoardCard}
     * @memberof GameScene
     * 
     * Used for the ondrop event: ln 96 mainScene.ts
     */
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
    /**
     *  Creates a set number of cards from a given dropzone
     *
     * @param {KevinOnline.Owner} owner
     * @param {number} card_id
     * @param {number} zone_id
     * @param {number} [amount=1]
     * @memberof GameScene
     * 
     * used from card ablity 
     */
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
    ownerInvert(ogOwner: KevinOnline.Owner): KevinOnline.Owner{
        if(ogOwner === "self")return "opponent";
        return "self";
    }
}