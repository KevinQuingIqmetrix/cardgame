//helper
import mapper = require("../tongitz.common/mapper")
//services 
import {TongitzService,ITongitzService} from "../tongitz.services/TongitzService"
//models.resource
import {gameStateResource} from     "../tongitz.models/resource/gameStateResource"
import {cardResource} from          "../tongitz.models/resource/cardResource"
import {playRequestResource} from   "../tongitz.models/resource/playRequestResource"
import {suiteEnumResource} from     "../tongitz.models/resource/suiteEnumResource"
//models.domain

import {gameState} from             "../tongitz.models/domain/gameState"
import {card} from                  "../tongitz.models/domain/card"
import {playedCard} from            "../tongitz.models/domain/playedCard"
import {turnPhaseEnum} from         "../tongitz.models/domain/turnPhaseEnum"
import {playerStatus} from          "../tongitz.models/domain/playerStatus"
import {house} from                 "../tongitz.models/domain/house"
import {suite} from                 "../tongitz.models/domain/suite"
// var s = require("")

//most methods return gamestate for now.
//in the future, chow returns nothing except httpstatusCode to update it's own gamestate
//also, draw returns a card, and play returns httpstatuscode
//in a farther future, instead of gamestate, send a turn number and return updates. this assumes client gamestate is unaltered
export interface ITongitzApi {
    //start new game and return state of new game
    NewGame(...players: string[])//: gameStateResource;
    //get current status of game
    GetState(gameId:number, playerId: number): gameStateResource;
    //
    CheckState(gameId:number, turn:number, playerId: number)
    //chow(cardid[]:number) //fit given cards with last discard to add as new house, cant draw anymore
    Chow(gameId:number,playerId:number,cards:number[]): void
    //draw() //get new card, cant chow anymore
    Draw(gameId:number,playerId:number): cardResource
    //play(playCards)
    Play(gameId:number, playerId:number, playCards:playRequestResource): gameStateResource

}
const rps:number = 13;
export class TongitzApi implements ITongitzApi {
    _svc: ITongitzService;

    constructor(tongitzService?: ITongitzService) {
        if(tongitzService)
            this._svc = tongitzService;
        else this._svc = new TongitzService();
    }
    public NewGame (...p: string[])//: gameStateResource {
    {
        let deck = this.generateDeck();
        deck = this.shuffle(deck);
        let newState = this.distribute(deck,...p);
        this._svc.saveState(newState);
        // return mapper.gameStateToResource(newState);
    }
    /**
    * desc: get gameStat from requester's perspective
    * params:
    * -gameId: id of the game retreiving. for now, it defaults to 1
    * -playerId: id of the player retreiving the gameState
     */
    public GetState (gameId: number, playerId: number) : gameStateResource{
        //service get whole gameState
        return mapper.gameStateToResource(this._svc.loadState(gameId),playerId);
    }
    /**
     * desc: 
     *      get gameState poll method. returns gameState if parameter:turn is less than current gameState turn 
     * params:
     * -turn: turn of last gameState fetched by player
     * -playerId: id of the player retreiving the gameState
     */
    public CheckState (gameId: number, turn: number, playerId: number) : gameStateResource{
        //return only when gameState.turn is different than passed turn
        //return gameState with turn only, when turn is same. else, gameStatus
        let state:gameState = this._svc.loadState(gameId);
        if (state.turn == turn)
        {
            let emptyState = new gameState();
            emptyState.turn = state.turn;
            return mapper.gameStateToResource(emptyState, playerId);
        }
        else {
            return mapper.gameStateToResource(state, playerId);
        }
    }
    /**
     * check parameters
     * -cards must be at least 2 to chow
     * check if player's turn and if hasn't drawn or chowed
     * check client authenticity/sync to server gameState cards
     * check if cards form a valid house
     * Create house from player's hand
     * Update phase
     * SaveState 
     */
    public Chow(gameId:number,playerId:number,cardIds:number[]) {
        if(cardIds.length < 2) //check if there are at least 2 cards
        {
            throw "badRequest:can't form a house with less than 3 cards"
        }
        let gameState = this._svc.loadState(gameId);
        let player = gameState.playerStatuses.filter(x => x.id == playerId)[0];

        this.validateTurnAndPhase(gameState,playerId,turnPhaseEnum.drawOrChow);
        this.validateCards(gameState,playerId,cardIds);
         
        let proposedHand:playedCard[] = [];
        //needs to splice from cards
        // player.hand.filter((x,i) => cardIds.indexOf(x.id) != -1).forEach(x => proposedHand.push(new playedCard(x,playerId,gameState.turn)));
        let proposedHandIndexes = player.hand.map((x,i) => [i,x] as [number,playedCard]).filter((x,i) => cardIds.indexOf(x[1].id) != -1);
        proposedHandIndexes.forEach(x => proposedHand.push(new playedCard(player.hand.splice(x[0],1)[0],playerId,gameState.turn)));
        proposedHand.push(gameState.discards.splice(gameState.discards.length-1,1)[0]);
        this.validateCombination(proposedHand)
        //splice cards from hand and discards to add a new house
        let newHouse = new house();
        newHouse.id = gameState.discards.length + 1;
        newHouse.playerId = playerId;
        proposedHand.forEach(x => newHouse.cards.push(x));
        //check if hand.length = 0; t=mark winner; f=continue
        if(player.hand.length < 1)
            gameState.winner = player.id
        //check if one card is left, call play and discard the card.
        //update gameState phase/turn to chow/draw = done
        gameState.turnPhase = turnPhaseEnum.play;
        this._svc.saveState(gameState,gameId)
        console.log(cardIds)
    }
    public Draw(gameId:number,playerId:number) {
        let gameState = this._svc.loadState(gameId);
        //check if turn of player
        //check if chowed or drawn already
        this.validateTurnAndPhase(gameState,playerId,turnPhaseEnum.drawOrChow);
        return {} as cardResource;
    }
    public Play(gameId:number, playerId: number, playCards: playRequestResource){



        let gameState = this._svc.loadState(gameId);
        if(gameState.deck.length < 1)
            gameState.winner = gameState.playerStatuses.map(x => [x.id,x.hand.length]).sort((x,y) => x[1]-y[1])[0][0];
        return {} as gameStateResource;
    }
    
    private generateDeck(){
        let deck:card[] = [];
        for (var i = 0; i < 52; i++)
            deck.push(new card(i, ((i + 1) % rps) || rps, suite[suite[Math.floor(i / rps) + 1]]));
        return deck;
    }
    private shuffle(deck: card[]){
        let returnDeck: card[] = [];
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
        p.forEach((x,i) => newGame.playerStatuses.push({name:x,turn:i+1,hand:[]} as playerStatus));
        newGame.playerStatuses.forEach(x => x.id = x.turn)//TODO: id should not be turn but for lack of implementation it is as it is
        newGame.turn = 1;
        newGame.turnPhase = turnPhaseEnum.play;
        for(let x = 0;x<13;x++)
            newGame.playerStatuses.forEach(p => p.hand.push(deck.splice(0,1)[0]))
        newGame.playerStatuses[0].hand.push(deck.splice(0,1)[0])
        return newGame;
    }

    private validateTurnAndPhase(gameState:gameState,playerId:number,turnPhaseEnum:turnPhaseEnum) : boolean{
        let playerTurn: number = gameState.playerStatuses.filter(p => p.id == playerId)[0].turn;
        if(playerTurn != ((gameState.turn - 1) % gameState.playerStatuses.length)+1 ) {
            throw "notAllowed: mot your turn"; 
            // return false;
        }
        if(gameState.turnPhase != turnPhaseEnum) {
            throw "notAllowed: not a valid move"; 
            // return false;
        }
        return true;
    }

    private validateCards(gameState:gameState,playerId:number,clientPlayerCards:number[]) : boolean {
        let player = gameState.playerStatuses.filter(x => x.id == playerId)[0];

        let isCardFromPlayer:boolean = clientPlayerCards.every(x => player.hand.map(c => c.id).indexOf(x) != -1);// all cards passed is indeed from player's hand'
        let noDupClientCards:boolean = clientPlayerCards.every((c,i) => clientPlayerCards.indexOf(c) == i);//check if there are duplicates in clientPlayerCards

        if(!(isCardFromPlayer && noDupClientCards)) {
            throw "notAllowed:cards does not match";
            // return false;
        }
        return true;
    }

    private validateCombination (cards:card[]) : boolean{
        if (!(this.isTrioQuadro(cards) || this.isStraightFlush(cards))) {
            throw "notAllowed: can't make a house"
            // return false;
        }
        return true;
    }
    private isTrioQuadro(cards:card[]) : boolean{
        return cards.every(x => x.rank == cards[0].rank)
    }
    
    private isStraightFlush(cards:card[]) : boolean{
        let isFlush = cards.every(x => x.suite == cards[0].suite);
        cards = cards.sort((p,n) => p.rank - n.rank);
        let is1Consecutive = cards.every((x,i) => ((cards[i+1-(Math.floor((i+1)/cards.length))].rank) - x.rank) < 2)
        return (isFlush && is1Consecutive) 
    }
}
// let a = new TongitzApi();
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