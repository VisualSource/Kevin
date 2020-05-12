import {GameObjects} from 'phaser';
import dragableCard from './cards/dragableCard';
import {clamp,lerp,select} from '../utils/Math';
import {CardDeckMannager} from '../utils/Loader';
export default class Hand extends GameObjects.Group implements KevinOnline.Objects.Hand {
    cards_in_hand = 0;
    max_cards_in_hand = 2;
    fly_in_direction: boolean = true;
    rotate_cards_to_offset: boolean = true;
    card_offset: number = 0;
    rotation_distance_scale_factor: number = 0.15;
    radius_offset: number = -0.05;
    card_spacing = 250;
    dynamic_spacing: boolean = true;
    dynamic_spacing_max_offset: number = 100;
    screenOffestX: number = window.innerWidth/2;
    screenOffestY: number = -window.innerHeight+100;
    card_scale: number = 1;
    constructor({scene, children}: KevinOnline.Params.IHandGroup){
        super(scene, children);
        scene.add.existing(this);
        this.init();
    }
    getCardPosistion(card_loop_index: number = 0){
        const a = this.cards_in_hand/this.max_cards_in_hand;
        const b = lerp(this.dynamic_spacing_max_offset,this.card_spacing,a);
        const c = clamp(this.card_spacing,this.dynamic_spacing_max_offset,b);
        const d = select(this.card_spacing,c,this.dynamic_spacing);
        const e = (this.cards_in_hand-1)/2.0;
        const f = e + this.card_offset; //a
        const g = card_loop_index - f;
        const h = g * d;
        const i = h * this.radius_offset;
        const j = i * g;
        const k = (j*-1.0) - this.screenOffestY;
        const l = k * this.card_scale;
        const o = select((h*-1.0),h,this.fly_in_direction);
        const n =  this.screenOffestX + (o * this.card_scale);
        const m = g * (20.0 * this.rotation_distance_scale_factor);
        const p = m * -1.0;
        const q = select(0.0,select(select(m,p,this.fly_in_direction),select(m,p,this.fly_in_direction),card_loop_index >= f),this.rotate_cards_to_offset) * -1.0;
        return {transialtion:{y: l, x: n}, angle: q}
    }
    calcCardPosistion(){
        this.children.entries.forEach((data,i: number)=>{
            const ps = this.getCardPosistion(i);
            (data as KevinOnline.Objects.DragableCard).x = ps.transialtion.x;
            (data as KevinOnline.Objects.DragableCard).y = ps.transialtion.y;
            (data as KevinOnline.Objects.DragableCard).setAngle(ps.angle);
            (data as KevinOnline.Objects.DragableCard).handPosition = ps;
        });
    }
    init(){
        this.cards_in_hand = this.children.entries.length;
        this.calcCardPosistion();
    }
    addCard(card: KevinOnline.Objects.DragableCard){
        this.add(card);
        this.init();
    }
    removeCard(card: KevinOnline.Objects.DragableCard){
        this.remove(card, true, true);
        this.init();
    }
    drawCard(owner: KevinOnline.Owner){
        const card = new dragableCard({scene: this.scene, id:CardDeckMannager.getInstance().getRandomCard(owner)});
        this.addCard(card); 
    }
    discardHand(){
        const cards = this.getChildren();
        for (let i = 0; i < cards.length; i++) {
            this.remove(cards[i], true, true);
        }
        setTimeout(()=>{
            const cardsa = this.getChildren();
            for (let i = 0; i < cardsa.length; i++) {
                this.remove(cardsa[i], true, true);
                this.init()
            }
        },3);
        this.init();
    }
}