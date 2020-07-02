
import QueryableWorker from '../state/OpponentHander';
import {RandomNumber} from '../utils/Math';

let instance: CardDeckMannager | null = null;
export class CardDeckMannager{
    userDeck: { id: number, ammount : number}[] = [];
    opponentDeck: { id: number, ammount : number}[] = [];
    selected_deck: string = "default";
    static getInstance(): CardDeckMannager{
        if(instance == null){
          instance = new CardDeckMannager();
        }
        return instance;
      }
    init(){
      const worker = QueryableWorker.getInstance();
      worker.addListeners("send_deck",()=>{
        worker.send("send_deck", { deck: this.userDeck});
      });
    }
     async fetchOpponentDeck(){
       const worker = QueryableWorker.getInstance();
          if(worker !== null) worker.send("request_deck",{});
          const data = await new Promise<{ id: number, ammount : number}[]>( (resolutionFunc,rejectionFunc) =>{
                worker?.addListeners("request_deck",(data: any)=>{
                  this.opponentDeck = data.deck;
                  resolutionFunc(data.deck);
                });
            
          });
        return await data;
      }
      get deckSet(){
        return this.userDeck.length > 0 ? true : false;
      }
      setDeck(id: string){
        const data = window.localStorage.getItem(`deck_${id}`);
        if(data !== null){
          this.userDeck = JSON.parse(data);
        }
        this.selected_deck = id;
        
      }
      getDecks(): string[]{
        let decks = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if(key?.includes("deck_")) decks.push((key as string).split("_")[1]);
        }
        return decks;
      }
      loadDeck(){
        try {
            this.userDeck = JSON.parse(window.localStorage.getItem(`deck_${this.selected_deck}`) as string);
            return this.userDeck;
        } catch (error) {
            console.log(error);
            return null;
        }
      }
      saveDeck(id: string = "default", deck: any[]){
            window.localStorage.setItem(`deck_${id}`, JSON.stringify(deck));
      }
      getRandomCard(owner:KevinOnline.Owner | "self_and_opponent"):number{
          switch (owner) {
            case "self":{
              const card = this.userDeck[RandomNumber(this.userDeck.length)];
              if(card.ammount < 0){
                return this.getRandomCard(owner);
              } else{
                card.ammount--;
                return card.id;
              }  
            }           
            case "opponent":{
              const card = this.opponentDeck[RandomNumber(this.opponentDeck.length)];
              if(card.ammount < 0){
                return this.getRandomCard(owner);
              }else{
                card.ammount--;
                return card.id;
              }  
            }
            default:
              return 0;
          }
      }
}