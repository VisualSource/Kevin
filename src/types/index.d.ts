declare namespace KevinOnline{
    type Owner = "self" | "opponent";
    type CardClass = "Warrior" | "Mage" | "Spy" | "Obelisk";
    type CardType = "Creature" | "Hero" | "Spell" | "Trap" | "Aura" | "Booster";
    type CardRarity = "Common" | "Un-common" | "Rare" | "Ultra-Rare" | "Legendary";
    type CardDamageType = "Basic" | "Poison" | "stun";
    namespace Params{
        interface BaseParams{ scene: Phaser.Scene;}
        interface ICardGroup extends BaseParams{}
        interface IDropZone extends BaseParams{
            posistion: IPosistion;
            owner: "opponent" | "self"
            id: number;
            graveyard: IPosistion
        }
        interface IDragableCard extends BaseParams{
            id: number;
            canInteract?: boolean;
            hidden?: boolean;
        }
        interface IHandGroup extends BaseParams{
            children: Phaser.GameObjects.GameObject[];
            config?: IHandConfigParams;
        }
        interface IBoardCard extends BaseParams{
            id: number;
            posistion: IPosistion;
            graveyard: IPosistion;
            dropzone_id: number;
        }
        interface IBoard extends BaseParams{
            owner: Owner;
            start: IPosistion;
            spacing: number;
            graveyard: IPosistion;
        }
        interface IHandConfigParams{
            cards_in_hand?:number; 
            max_cards_in_hand?:number;
            fly_in_direction?: boolean;
            rotate_cards_to_offset?: boolean;
            card_offset?: number;
            rotation_distance_scale_factor?: number;
            radius_offset?: number;
            card_spacing?:number;
            dynamic_spacing?: boolean;
            dynamic_spacing_max_offset?: number;
            screenOffestX?: number;
            screenOffestY?: number;
            card_scale?: number;
        }
    }
    namespace Objects{
        interface CardGroup extends Phaser.GameObjects.Group{}
        interface BoardCard extends Phaser.GameObjects.Sprite{
            cardData: CardData;
            lifeSpan: number;
            owner: Owner;
            attack: number;
            actionPoints: number;
        }
        interface DragableCard extends Phaser.GameObjects.Sprite{
            handPosition:{
                transialtion:IPosistion, 
                angle: number
            }
            cardData: CardData;
        }
        interface DropZone extends Phaser.GameObjects.Zone{
            graveyard: IPosistion;
            id: number;
        }
        interface Hand extends Phaser.GameObjects.Group{
            cards_in_hand:number;
            max_cards_in_hand:number;
            fly_in_direction: boolean;
            rotate_cards_to_offset: boolean;
            card_offset: number;
            rotation_distance_scale_factor:number;
            radius_offset: number;
            card_spacing: number;
            dynamic_spacing: boolean;
            dynamic_spacing_max_offset: number;
            screenOffestX: number;
            screenOffestY: number;
            card_scale: number;
            removeCard(card: dragableCard): void;
            addCard(card: DragableCard);
            drawCard(owner: KevinOnline.Owner)
            discardCard(amount?: number): void;
            discardAll(): void;
            init(): void;
            public getCardList(): number[];
            public addCardById(id: number,hidden: boolean = false, canInteract: boolean = true): this;
           
        }
        interface MainGameScene extends Phaser.Scene{
            graveyard_a;
            graveyard_b;
            settings: Settings;
            worker: QueryableWorker;
            player_hand: Hand;
            opponent_hand: Hand;
            player_1_board: any;
            player_2_board: any;
            player_1_board_c: any;
            player_2_board_c: any;
            gameState: any;
            spawnCard(owner: KevinOnline.Owner | "self_and_opponent", card_id:number, zone_id:number, amount: number = 1);
            newCard(owner: KevinOnline.Owner, dropZone: KevinOnline.Objects.DropZone, card_id: number, active: boolean = true): KevinOnline.Objects.BoardCard
        }
    }
    interface IPosistion {
        x: number;
        y: number;
    }
    interface CardAbilities{
        type: "none" | "draw_card" | "increase_attack" | "clone" | "increase_player_health" | "retaliation_damage" | "damage_all_cards_on_board" | "spawn_card_from_deck" | "give_turn_points_to_all_active_cards" | "increase_turn_points" | "discard_cards_in_hand" | "pickup_first_creature_in_graveyard_to_board" | "pickup_first_creature_in_graveyard_to_hand" | "possess_opponents_card" | "swap_cards_in_hand"
        ability_int: number;
        trigger: "none" | "on_drop" | "start_of_turn" | "end_of_turn" | "takes_damage"| "send_to_graveyard"| "death_by_life_expectancy";
        after_use_state: "remain_in_play" | "single_use_to_graveyard_after_ability" | "single_use_to_graveyard_before_ability";
        partice: string;
        sound_cue: string;
        affecting_player: Owner | "self_and_opponent"
    }
    interface CardData{
        index: number;
        name: string;
        class: CardClass;
        rarity: CardRarity;
        special: boolean;
        visual: {
            front_texture: string;
            back_texture: string;
        }
        attack:{
            damage: number;
            mana_cost: number;
            can_attack_player: boolean;
            can_attack_cards: boolean;
            damage_type: CardDamageType;
            attack_particle: string;
            sound_cue_attack: string;
        },
        health:{
            health: number;
            life_expectancy: number;
            death_particle: string;
            sound_cue_death: string;
        }
        abilities: CardAbilities[];
        description: string;
        placement_settings:{
            owner: Owner | "self_and_opponent";
            mana_cost: number;
            entry_particle: string;
            sound_cue_entry: string;
        }
        deck_settings:{
            unlocked: boolean;
            add_to_player_deck: boolean;
            max_num_in_deck: number;
            weight: number;
            screen_size:{
                x: number;
                y: number;
            }
        }
    }
    interface Settings{
        uuid: string;
        online: boolean;
    }
    interface QueryableWorker{
        private workerInstance: Worker;
        private listeners: {[name: string]: Function};
        onMessage(event: MessageEvent): void;
        onError(error: ErrorEvent): void;
        send(name: string, data: any): this;
        terminate(): this;
        addListeners(name: string, listener: Function): this;
        removeAllListeners(): this;
        removeListeners(name: string): this;
    }
}

declare namespace Phaser{
     namespace GameObjects{
        interface Sprite{
            /**
             * Kill sprite
             */
            kill(): void
            damage(value: number): void
        }
    }
}