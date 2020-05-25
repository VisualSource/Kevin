import React,{useState, useEffect} from 'react';
import {Button, Select, Input, Card, Tag, Modal} from 'shineout';


import CardJson from '../../game/utils/Loader';
import { routeTo } from '../../utils/history';

interface IDeck{
    id: number;
    amount: number;
}
export default function DeckEditor(){
    const [modal, setModel] = useState(false);
    const [cards, setCards] = useState<KevinOnline.CardData[]>([]);
    const [deck,setDeck] = useState<IDeck[]>([]);
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
    const exit = (save: boolean = false)=>{
        routeTo("/",{});
    }
    useEffect(()=>{
        document.title = "Kevin Online - Deck Editor";
        CardJson.getInstance().fetch().then(data=>{
            setCards(data.cards);
        });
        calcCount();
    },[]);
    return <div id="editor">
            <Modal title="You have a unsaved deck!" visible={modal} onClose={()=>setModel(false)} footer={
                [<Button onClick={()=>exit()}>Save and Exit</Button>,
                <Button onClick={()=>exit()}>Exit</Button>]}>
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
                                                    <Button type="link" onClick={()=>{
                                                        setViewCard(deck[card.index]);
                                                    }}>View</Button>
                                                </div>
                                          </Card>
                                })
                            }
                    </section>
                </section>
                <div id="deck">
                        <Input size="small" placeholder="Deck Name" onChange={(value)=>{setDeckName(value)}}/>
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

