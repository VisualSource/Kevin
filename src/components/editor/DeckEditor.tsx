import React,{useState, useEffect} from 'react';
import {Button, Select, Input, Card, Tag} from 'shineout';


//import CardJson from '..';
const test =  {
    "index":0,
    "name":"Pyromaniac Kevin",
    "type":"Trap",
    "class":"Obelisk",
    "rarity":"Common",
    "special": false,
    "visual":{
        "front_texture":"pyro_kevin",
        "back_texture":"default"
    },
    "attack":{
        "damage": 0,
        "mana_cost":0,
        "can_attack_player": false,
        "can_attack_cards": false,
        "damage_type":"basic",
        "attack_particle":"",
        "sound_cue_attack":""
    },
    "health":{
        "health": 1,
        "life_expectancy": 10,
        "death_particle": "",
        "sound_cue_death":""
    },
    "abilities":[
        {
            "type":"discard_cards_in_hand",
            "ability_int": 1,
            "trigger": "on_drop",
            "after_use_state":"remain_in_play",
            "affecting_player":"self",
            "partice":"",
            "sound_cue":""
        }
    ],
    "description":"Hand a bit to much fun",
    "placement_settings":{
        "owner":"opponent",
        "mana_cost": 2,
        "entry_particle":"",
        "sound_cue_entry":""
    },
    "deck_settings":{
        "unlocked": true,
        "add_to_player_deck": true,
        "max_num_in_deck": 3,
        "weight": 0,
        "screen_size":{
            "x":200,
            "y": 280
        }
    }
}
export default function DeckEditor(){
    document.title = "Kevin Online - Deck Editor";
    const [cards, setCards] = useState([test]);
    const [deck,setDeck] = useState([{id:0, amount: 1}]);
    const [cardCount, setCardCount] = useState<number>(0);
    const [viewCard,setViewCard] = useState({});
    const [isDeckSaved,setIsDeckSaved] = useState(false);
    const [deckName, setDeckName] = useState("");
    const calcCount = () => {
            let count = 0;
            deck.forEach(data=>{
                count += data.amount;
            });
            setCardCount(count);
            return count;
    }
    useEffect(()=>{
        calcCount();
    },[])
   
   
    return <div id="editor">
            <div id="card-viewer"> 
                <Button type="secondary" onClick={()=>window.history.back()}>Exit</Button>
                <canvas></canvas>
            </div>
            <div id="card-selection">
                <section id="finder">
                    <nav>
                        <Select onCreate={(text)=>text} keygen={(data: any)=>`${data}${Math.random().toPrecision(3)}`} data={["Common","Un-common","Rare","Spell","Trap"]} placeholder="Search" multiple onFilter={text => d => d.indexOf(text) >= 0} filterDelay={0}/>
                        <Button type="primary">Search</Button>
                    </nav>
                    <section>
                            {
                                cards.map(card=>{
                                    const amount = deck[card.index] ? deck[card.index].amount : 0;
                                    return <Card key={card.name}>
                                                <h3>{card.name}</h3>
                                                <p>{card.description}</p>
                                                <div>
                                                    <span>
                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                        <defs>
                                                            <clipPath id="clip-path">
                                                            <rect className="cls-1" width="16" height="16"/>
                                                            </clipPath>
                                                        </defs>
                                                        <g id="Symbol_96_1" data-name="Symbol 96 – 1" className="cls-2">
                                                            <path id="Chat" className="cls-3" d="M5,8A.945.945,0,0,0,6,9h4a1,1,0,0,0,1-1,.945.945,0,0,0-1-1H6A1,1,0,0,0,5,8ZM0,5A4.951,4.951,0,0,1,5,0h6a4.951,4.951,0,0,1,5,5V15a.945.945,0,0,1-1,1H5a4.951,4.951,0,0,1-5-5Z"/>
                                                        </g>
                                                        </svg>
                                                       {amount} of {card.deck_settings.max_num_in_deck}
                                                    </span>
                                                    <Button type="link" onClick={()=>{
                                                        if(deck[card.index]){
                                                            if(card.deck_settings.max_num_in_deck > deck[card.index].amount && cardCount < 50){
                                                                deck[card.index].amount++;
                                                                setDeck(deck);
                                                                calcCount();
                                                            }
                                                        }else{
                                                            if(cardCount < 50){
                                                                deck.push({id: card.index, amount: 1});
                                                                setDeck(deck);
                                                                calcCount();
                                                            }
                                                        }
                                                    
                                                    }}>Add</Button>
                                                    <Button type="link" onClick={()=>{}}>View</Button>
                                                </div>
                                          </Card>
                                })
                            }
                    </section>
                </section>
                <div id="deck">
                        <Input size="small" placeholder="Deck Name"/>
                        <section>
                            {
                                deck.map(card=>{
                                    return <Tag key={card.id} onClose={()=>{
                                        setDeck(deck.filter(data=>data.id !== card.id));
                                        setTimeout(()=>{
                                            setCardCount(calcCount());
                                        },1)
                                    }}>
                                            {card.amount}
                                            {cards[card.id].name}
                                        </Tag>    
                                })
                            }
                        </section>
                        <h2>{deck.length > 0 ? cardCount: 0} of 50</h2>
                    </div>
            </div>
          </div>;
}

