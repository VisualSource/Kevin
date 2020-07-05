import React,{useState, useEffect, createRef} from 'react';
import * as JsSearch from 'js-search';
import {Button, Select, Input, Card, Tag, Modal, Rule,CardGroup, Spin} from 'shineout';
import {JsonLoader} from '@visualsource/vs_api';
import {init, event} from './viewer';
import { routeTo } from '../../utils/history';

function Item({  name }:KevinOnline.CardData) {
    return (
      <div style={{ padding: 20 }}>
        <div>
          <div style={{ width: 40, height: 40, display: 'inline-flex', borderRadius: '50%', background: '#99A3A4' }}>
            
          </div>
          <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500, color: 'rgba(51,62,89,1)' }}>{name}</span>
        </div>
        <p style={{ margin: '20px 0', fontSize: 14, color: 'rgba(153,157,168,1)' }}>
          Add or delete tag for your customer. You can sort your customer...
        </p>
        <div style={{ color: 'rgba(102,108,124,1)' }}>
          
          Add This
        </div>
      </div>
    )
  }
const rule = Rule();
const placeholder = (
    <div style={{ width: '100%', height: 200, display: 'flex' }}>
      <Spin style={{ margin: 'auto' }} />
    </div>
  )
const errorCard: KevinOnline.CardData =  {
    index:0,
    name:"Load Error",
    type:"",
    class:"Obelisk",
    rarity:"Common",
    special: false,
    visual:{
        front_texture:"pyro_kevin",
        back_texture:"default"
    },
    attack:{
        damage: 0,
        mana_cost:0,
        can_attack_player: true,
        can_attack_cards: true,
        damage_type:"basic",
        status_length: 0,
        attack_particle:"",
        sound_cue_attack:""
    },
    health:{
        health: 0,
        life_expectancy: 0,
        death_particle: "",
        sound_cue_death:""
    },
    abilities:[ ],
    description:"",
    placement_settings:{
        owner:"self",
        mana_cost: 0,
        entry_particle:"",
        sound_cue_entry:""
    },
    deck_settings:{
        unlocked: true,
        add_to_player_deck: true,
        max_num_in_deck: 0,
        weight: 0,
        screen_size:{
            x:200,
            y: 280
        }
    }
}
const search = new JsSearch.Search("index");
search.addIndex("name");
search.addIndex("type");
search.addIndex("class");
search.addIndex("rarity");
search.addIndex("description");
let carddefault : KevinOnline.CardData[] = [];
export default function DeckEditor(){
    const [cardList, setCardList] = useState<KevinOnline.CardData[]>([]);
    useEffect(()=>{
        JsonLoader.getInst()
        .fetch<{cards: KevinOnline.CardData[]}>()
        .then(value=>{
            setCardList(value.cards);
            carddefault = value.cards;
            search.addDocuments(value.cards);
        })
        .catch(err=>{});
       
    },[]);
    return <div id="editor">
        <section id="card-viewer">
            <Button>Exit</Button>
            <canvas></canvas>
        </section>
        <section id="card-selection">
            <div id="card-list">
            <Input.Group>
                <Input placeholder="search text" onEnterPress={(value: string)=>{
                        if(value === "") {
                            setCardList(carddefault);
                        }else{
                            setCardList(search.search(value) as KevinOnline.CardData[]);
                        }
                }}/>
                <Button type="primary">Search</Button>
            </Input.Group>
            <CardGroup height={300} columns={2}>
                    {cardList.map(v => (
                        <CardGroup.Item key={v.name} placeholder={placeholder} checked={false}>
                            <Item {...v} />
                        </CardGroup.Item>
                    ))}
            </CardGroup>
            </div>
            <nav id="deck-builder">
                <Input.Group>
                    <Input placeholder="deck name" onEnterPress={(value: string)=>{}}/>
                    <Button type="primary">Save</Button>
                </Input.Group>
                <CardGroup height={300} columns={1}>
                        <CardGroup.Item key={"d"}>
                            <Tag onClose={() => console.log('I am close')} onClick={() => console.log('I am click')}>
                                Tag 3
                            </Tag>
                        </CardGroup.Item>
                </CardGroup>
            </nav>
        </section>
    </div>
}

/*

interface IDeck{
    id: number;
    amount: number;
}
const decknameRule = Rule();
export default function DeckEditor(){
    const cv = createRef<HTMLCanvasElement>();
    const [modal, setModel] = useState(false);
    const [cards, setCards] = useState<KevinOnline.CardData[]>([]);
    const [deck,setDeck] = useState<IDeck[]>([]);
    const [cardCount, setCardCount] = useState<number>(0);
    const [viewCard,setViewCard] = useState<KevinOnline.CardData>();
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
    const exit = (save: boolean = false)=>{
        routeTo("/",{});
    }
    useEffect(()=>{
        document.title = "Kevin Online - Deck Editor";
        JsonLoader.getInst().fetch<{ cards: KevinOnline.CardData[]}>().then(data=>{
            setCards(data.cards);
        });
       
        calcCount();
        if(cv.current) init(cv.current);
    },[]);
    return <div id="editor">
            <Modal title="You have a unsaved deck!" visible={modal} onClose={()=>setModel(false)} footer={
                [<Button key={1} onClick={()=>exit()}>Save and Exit</Button>,
                <Button key={2} onClick={()=>exit()}>Exit</Button>]}>
                    Do you want to save the changes?
                </Modal>
            <div id="card-viewer"> 
                <Button type="secondary" onClick={()=>{
                    if(!isDeckSaved){
                        setModel(true);
                    }else{
                        exit();
                    }
                }}>Exit</Button>
                <canvas ref={cv}></canvas>
                {
                    viewCard !== undefined ? 
                    <Card shadow>
                        <Card.Body>
                            <h6>{viewCard?.rarity}</h6>
                            <h2>{viewCard.name}</h2>
                            <p>{viewCard.description}</p>
                        </Card.Body>
                    </Card> 
                    : null
                }
            </div>
            <div id="card-selection">
                <section id="finder">
                    <nav>
                        <Select onCreate={(text: string)=>text} keygen={(data: any)=>`${data}${Math.random().toPrecision(3)}`} data={["Common","Un-common","Rare","Spell","Trap"]} placeholder="Search" multiple onFilter={(text: string) => (d: any[]) => d.indexOf(text) >= 0} filterDelay={0}/>
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
                                                    <Button type="link" onClick={()=>{
                                                        event.emit("restart",cards[card.index]);
                                                        setViewCard(cards[card.index]);
                                                    }}>View</Button>
                                                </div>
                                          </Card>
                                })
                            }
                    </section>
                </section>
                <div id="deck">
                         <Input size="small" placeholder="Deck Name" type="text" rules={[decknameRule.required, decknameRule.min(4)]} onChange={(value: string)=>{setDeckName(value)}}/>
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
                                            {cards[card.id]?.name}
                                        </Tag>    
                                })
                            }
                        </section>
                        <h2>{deck.length > 0 ? cardCount: 0} of 50</h2>
                    </div>
            </div>
          </div>;
}

*/