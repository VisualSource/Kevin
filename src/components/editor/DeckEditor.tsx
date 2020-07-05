import React,{useState, useEffect, createRef, useReducer} from 'react';
import * as JsSearch from 'js-search';
import {Button, Select, Input, Card, Tag, Modal, Rule,CardGroup, Spin, Form} from 'shineout';
import {JsonLoader} from '@visualsource/vs_api';
import {init, event} from './viewer';
import { routeTo } from '../../utils/history';
import { count } from 'console';




const placeholder = (
    <div style={{ width: '100%', height: 200, display: 'flex' }}>
      <Spin style={{ margin: 'auto' }} />
    </div>
  );
const search = new JsSearch.Search("index");
search.addIndex("name");
search.addIndex("type");
search.addIndex("class");
search.addIndex("rarity");
search.addIndex("description");
let carddefault : KevinOnline.CardData[] = [];

interface IdeckListState{
    id: number;
    amount: number;
    name: string;
}
function deckListReducer(state: {deck: IdeckListState[], count: number}, action: { type: string, data: IdeckListState}){
    switch (action.type) {
        case "add":{
            if(state.count < 50){
                const card = state.deck.findIndex(value=>value.id === action.data.id);
                if(card !== -1){
                    if(carddefault[action.data.id].deck_settings.max_num_in_deck > state.deck[card].amount){
                        state.deck[card].amount++ 
                        state.count++
                    }
                }else{
                    state.deck.push({ name: action.data.name, id: action.data.id, amount: 1});
                    state.count ++;
                }
            }
            return { count: state.count, deck: state.deck};
        }
        case "remove":{
            if(state.count < 50){
                const card = state.deck.findIndex(value=>value.id === action.data.id);
                if(card !== -1){
                    state.deck[card].amount = state.deck[card].amount - action.data.amount;
                    state.count = state.count - action.data.amount;
                    if(state.deck[card].amount < 1) state.deck.splice(card, 1);
                }
            }
            return { count: state.count, deck: state.deck};
        }
        case "reset":
            return { count: 0, deck: []}
        default:
            return state;
    }
}
export default function DeckEditor(){
    const [modala, setModalA] = useState(false);
    const [cardList, setCardList] = useState<KevinOnline.CardData[]>([]);
    const [deckList, dispatchDeck] = useReducer<(state: {deck: IdeckListState[], count: number}, action: {type: string; data: IdeckListState})=>{deck: IdeckListState[], count: number}>(deckListReducer, {deck: [{id:0,amount:1,name:"Pyromic Kevin"}], count: 1});
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
        <Modal title="Select Deck to edit" visible={modala} onClose={()=>setModalA(false)}>
               <div id="deck-load">
                    <Select keygen style={{ width: 240 }} data={[]} placeholder="Select Deck"/>
                    <Button>Load</Button>
               </div>
        </Modal>
        <Modal title="Save Deck?" visible={false}></Modal>
        <section id="card-viewer">
            <Button>Exit</Button>
            <canvas></canvas>
        </section>
        <section id="card-selection">
            <div id="card-list">
            <div id="card-settings">
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
                <Button.Group outline type="primary">
                    <Button>Save</Button>
                    <Button onClick={()=>setModalA(true)}>Load</Button>
                    <Button onClick={()=>dispatchDeck({type:"reset", data:{id:0, amount:0, name:""}})}>Reset</Button>
                </Button.Group>
            </div>
            <CardGroup height={300} columns={2}>
                    {cardList.map(v => (
                        <CardGroup.Item key={v.name} placeholder={placeholder} checked={false}>
                             <div style={{ padding: 20 }}>
                                <div>
                                    <div style={{ width: 40, height: 40, display: 'inline-flex', borderRadius: '50%', background: '#99A3A4' }}>
                                        
                                    </div>
                                    <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500, color: 'rgba(51,62,89,1)' }}>{v.name}</span>
                                    </div>
                                    <p style={{ margin: '20px 0', fontSize: 14, color: 'rgba(153,157,168,1)' }}>
                                    Add or delete tag for your customer. You can sort your customer...
                                    </p>
                                    <Button type="link" onClick={()=>dispatchDeck({type:"add", data: {name: v.name, id: v.index, amount:1}})}>Add To Deck</Button>
                            </div>
                        </CardGroup.Item>
                    ))}
            </CardGroup>
            </div>
            <nav id="deck-builder">
                <Input.Group>
                    <Input placeholder="deck name" onEnterPress={(value: string)=>{
                        console.log(value);
                    }}/>
                    <Button type="primary">Save</Button>
                </Input.Group>
                <CardGroup height={500} columns={1} gap={5}>
                        {
                            deckList.deck.map(value=>{
                                return <CardGroup.Item key={value.id}>
                                    <Tag onClose={() => dispatchDeck({type:"remove", data: {id: value.id, name: value.name, amount:value.amount}})} onClick={() => console.log('I am click')}>
                                       {`${value.amount} ${value.name}`}
                                    </Tag>
                                </CardGroup.Item>
                            })
                        }

                </CardGroup>
                <div>
                    <p>{`${deckList.count} of 50`}</p>
                </div>
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