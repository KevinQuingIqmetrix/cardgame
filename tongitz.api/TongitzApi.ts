//helper
import {mapper} from "../tongitz.common/mapper"
//services
import {TongitzService,ITongitzService} from "../tongitz.services/TongitzService"
//models.resource
import {gameStateResource} from "../tongitz.models/resource/gameStateResource"
import {cardResource} from "../tongitz.models/resource/cardResource"
import {playCardResource} from "../tongitz.models/resource/playCardResource"
import {suiteResource} from "../tongitz.models/resource/suiteResource"
//models.domain
import {gameState, house,playerStatus,turnPhaseEnum} from "../tongitz.models/domain/gameState"
import {card,playedCard} from "../tongitz.models/domain/card"
import {suite} from "../tongitz.models/domain/suite"

//most methods return gamestate for now.
//in the future, chow returns nothing except httpstatusCode to update it's own gamestate
//also, draw returns a card, and play returns httpstatuscode
//in a farther future, instead of gamestate, send a turn number and return updates. this assumes client gamestate is unaltered
interface ITongitzApi {
    //start new game and return state of new game
    NewGame(...players: string[]): gameStateResource;
    //get current status of game
    GetStatus(id:number): gameStateResource;
    //chow(cardid[]:number) //fit given cards with last discard to add as new house, cant draw anymore
    Chow(cards: number[]): void
    //draw() //get new card, cant chow anymore
    Draw(): cardResource
    //play(playCards)
    Play(playCards:playCardResource): gameStateResource

}
const rps:number = 13;
class TongitzApi implements ITongitzApi {
    _svc: ITongitzService;

    constructor(tongitzService?: ITongitzService) {
        if(tongitzService)
            this._svc = tongitzService;
        else this._svc = new TongitzService();
    }
    public NewGame (...p: string[]): gameStateResource {
        
        let deck = this.generateDeck();
        deck = this.shuffle(deck);
        let newState = this.distribute(deck,...p);
        this._svc.saveState(newState);
        return mapper.gameStateToResource(newState);
    }
    public GetStatus (id: number) : gameStateResource{
        //service get whole gameState
        return mapper.gameStateToResource(this._svc.loadState());
    }
    public CheckState (turn:number) : gameStateResource{
        //return only when gameState.turn is different than passed turn
        //return gameState with turn only, when turn is same. else, gameStatus
        let state:gameState = this._svc.loadState();
        if (state.turn == turn)
        {
            let emptyState = new gameState();
            emptyState.turn = state.turn;
            return mapper.gameStateToResource(emptyState);
        }
        else {
            return mapper.gameStateToResource(state);
        }
    }
    public Chow(cards:number[]) {
        //check if turn of player
        //check if chowed or drawn already
        //check if cards are from player's hand'
        //check if chow using cards and last discard is valid

        //splice cards from hand and discards to add a new house
        //check if hand.length = 0; t=mark winner; f=continue
        //update gameState phase/turn to chow/draw = done
        //service 
        console.log(cards)
    }
    public Draw(){
        return {} as cardResource;
    }
    public Play(playCards: playCardResource){
        return {} as gameStateResource;
    }
    
    private generateDeck(){
        let deck:card[] = [];
        for (var i = 0; i < 52; i++)
            deck.push(new card(i, ((i + 1) % rps) || rps, suite[suite[Math.floor(i / rps) + 1]]));
        return deck;
    }
    private shuffle(deck: card[]){
        let returnDeck: card[];
        let cloneDeck = deck.map(x => x);
        deck.forEach(function (card,index){
            let randomCardIndex = Math.floor(Math.random() * cloneDeck.length);
            let randomCardTaken = cloneDeck.splice(randomCardIndex,1)[0];
            returnDeck.push(randomCardTaken);
        })
        return returnDeck;
    }
    private distribute(deck:card[],...p:string[]){
        let newGame = new gameState();
        newGame.deck = deck;
        newGame.discards = [];
        newGame.houses = [];
        newGame.id = 1;
        newGame.playerStatuses = [];
        p.forEach((x,i) => newGame.playerStatuses.push({name:x,id:i,hand:[]} as playerStatus));
        newGame.turn = 1;
        newGame.turnPhase = turnPhaseEnum.play;
        return newGame;
    }
}

// class thing {
//     /**
//      *
//      */
//     constructor() {
//         console.log("initialized");
//     }
//     ha(){
//         console.log("ha");
//     }
//     public int: number
// }
// var a = new thing();
// console.log(a);
// console.log(JSON.stringify(a));
// console.log(thing);
// console.log(JSON.stringify(thing));