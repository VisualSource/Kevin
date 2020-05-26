import {GameObjects} from 'phaser';
import dragableCard from './cards/dragableCard';
import {clamp,lerp,select} from '../utils/Math';
import {CardDeckMannager} from '../utils/Loader';
export default class Hand extends GameObjects.Group implements KevinOnline.Objects.Hand {
    public cards_in_hand: number = 0;
    public max_cards_in_hand: number = 30;
    public fly_in_direction: boolean = true;
    public rotate_cards_to_offset: boolean = true;
    public card_offset: number = 0;
    public rotation_distance_scale_factor: number = 0.15;
    public radius_offset: number = -0.05;
    public card_spacing: number = 250;
    public dynamic_spacing: boolean = true;
    public dynamic_spacing_max_offset: number = 100;
    public screenOffestX: number = window.innerWidth/2;
    public screenOffestY: number = -window.innerHeight+100;
    public card_scale: number = 1;
    constructor({scene, children, config}: KevinOnline.Params.IHandGroup){
        super(scene, children);
        this.cards_in_hand = config?.cards_in_hand ?? 0;
        this.max_cards_in_hand = config?.max_cards_in_hand ?? 30;
        this.fly_in_direction = config?.fly_in_direction ?? true;
        this.rotate_cards_to_offset = config?.rotate_cards_to_offset ?? true;
        this.card_offset = config?.card_offset ?? 0;
        this.rotation_distance_scale_factor = config?.rotation_distance_scale_factor ?? 0.15;
        this.radius_offset = config?.radius_offset ?? -0.05;
        this.card_spacing = config?.card_spacing ?? 250;
        this.dynamic_spacing = config?.dynamic_spacing ?? true;
        this.dynamic_spacing_max_offset = config?.dynamic_spacing_max_offset ?? 100;
        this.screenOffestX = config?.screenOffestX ?? (window.innerWidth/2);
        this.screenOffestY = config?.screenOffestY ?? (-window.innerHeight+80);
        this.card_scale = config?.card_scale ?? 1;
        scene.add.existing(this);
        this.init();
    }
    private getCardPosistion(card_loop_index: number = 0){
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
    private calcCardPosistion(){
        this.children.entries.forEach((data,i: number)=>{
            const ps = this.getCardPosistion(i);
            (data as KevinOnline.Objects.DragableCard).x = ps.transialtion.x;
            (data as KevinOnline.Objects.DragableCard).y = ps.transialtion.y;
            (data as KevinOnline.Objects.DragableCard).setAngle(ps.angle);
            (data as KevinOnline.Objects.DragableCard).handPosition = ps;
            (data as KevinOnline.Objects.DragableCard).setDepth(ps.angle);
        });
    }
    init(){
        this.cards_in_hand = this.children.entries.length;
        this.calcCardPosistion();
    }
    public addCard(card: KevinOnline.Objects.DragableCard): this{
        this.add(card);
        this.init();
        return this;
    }
    public removeCard(card: KevinOnline.Objects.DragableCard): this{
        this.remove(card, true, true);
        this.init();
        return this;
    }
    public getCardList(): number[]{
        const cards = this.getChildren();
        return cards.map((card)=>{
            return (card as KevinOnline.Objects.DragableCard).cardData.index;
        });
    
    }
    public drawCard(owner: KevinOnline.Owner): this{
        const card = new dragableCard({scene: this.scene, id:CardDeckMannager.getInstance().getRandomCard(owner)});
        this.addCard(card); 
        return this;
    }
    public addCardById(id: number, hidden: boolean = false, canInteract: boolean = true): this{
        this.addCard(new dragableCard({scene: this.scene, id, canInteract, hidden})); 
        return this;
    }
    public discardCard(amount: number = 1): this{
        const cards = this.getChildren();
        if(amount > cards.length) return this;
        for (let i = 0; i <= amount; i++) {
            this.remove(cards[i], true, true);
        }
        this.init();
        return this;
    }
    public discardAll(): this{
        this.clear(true,true);
        this.init();
        return this;
    }
}

/**
 * 
 * 
 * 
 */