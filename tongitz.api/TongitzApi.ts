//helper
import mapper = require("../tongitz.common/mapper")
//services 
import {TongitzService,ITongitzService} from "../tongitz.services/TongitzService"
//models.resource
import resource = require("../tongitz.models/resource/_resource")
//models.domain
import domain = require("../tongitz.models/domain/_domain")

//most methods return gamestate for now.
//in the future, chow returns nothing except httpstatusCode to update it's own gamestate
//also, draw returns a card, and play returns httpstatuscode
//in a farther future, instead of gamestate, send a turn number and return updates. this assumes client gamestate is unaltered
export interface ITongitzApi {
    //start new game and return state of new game
    NewGame(id?:number,...players: string[]): void//: gameStateResource;
    //get current status of game
    GetState(gameId:number, playerId: number): resource.gameStateResource;
    //
    CheckState(gameId:number, turn:number, playerId: number): resource.gameStateResource
    //chow(cardid[]:number) //fit given cards with last discard to add as new house, cant draw anymore
    Chow(gameId:number,playerId:number,cards:number[]): void
    //draw() //get new card, cant chow anymore
    Draw(gameId:number,playerId:number): resource.cardResource
    //play(playCards)
    Play(gameId:number, playerId:number, playCards:resource.playRequestResource)

}
const rps:number = 13;
export class TongitzApi implements ITongitzApi {
    _svc: ITongitzService;

    constructor(tongitzService?: ITongitzService) {
        if(tongitzService)
            this._svc = tongitzService;
        else this._svc = new TongitzService() as any;
        //TODO: remove as any!!!!!!!!!!!!!`````````````````````
    }
    public NewGame (gameId?:number,...p: string[]) : void//: gameStateResource {
    {
        gameId = gameId || 1;
        //set gameId, turn, phase
        this._svc.addGame(gameId,1,domain.turnPhaseEnum.play);
        //make players, set name,turn,id , store in var
        let players = p.map((x,i) => {
            return {
                id:i+1,
                name:x,
                turn:i+1,
                hand:[]
            } as domain.playerStatus
        })
        //make deck, shuffle, store in var
        let deck = this.shuffle(this.generateDeck());
        //distribute/splice cards
        for(let x = 0;x<11;x++)
            players.forEach(x => x.hand.push(deck.splice(0,1)[0]));
        players[0].hand.push(deck.splice(0,1)[0])
        //save deck
        this._svc.setDeck(gameId,deck)
        //save players
        players.forEach(x => this._svc.addPlayer(gameId,x))
        //save changes
        this._svc.applyState(gameId);
    }
    /**
    * desc: get gameStat from requester's perspective
    * params:
    * -gameId: id of the game retreiving. for now, it defaults to 1
    * -playerId: id of the player retreiving the gameState
     */
    public GetState (gameId: number, playerId: number) : resource.gameStateResource{
        gameId = gameId || 1;
        //service get whole gameState
        return mapper.gameStateToResource(this._svc.fetchState(gameId),playerId);
    }
    /**
     * desc: 
     *      get gameState poll method. returns gameState if parameter:turn is less than current gameState turn 
     * params:
     * -turn: turn of last gameState fetched by player
     * -playerId: id of the player retreiving the gameState
     */
    public CheckState (gameId: number, playerId: number, turn: number) : resource.gameStateResource{
        gameId = gameId || 1;
        //return only when gameState.turn is different than passed turn
        //return gameState with turn only, when turn is same. else, gameStatus
        //getState

        let gameTurn:number = this._svc.getTurn(gameId);
        if(gameTurn == turn){
            let emptyState = new domain.gameState();
            emptyState.turn = gameTurn;
            return mapper.gameStateToResource(emptyState, playerId);
        }
        else {
            return mapper.gameStateToResource(this._svc.fetchState(gameId), playerId);
        }
    }
    /**
     * could check if deck.length > 0, but if the game can be marked as ended (if really ended) every chow and play, then just check that
     */
    public Draw(gameId:number,playerId:number):resource.cardResource {
        this.validateGameOnGoing(this._svc.getWinMethod(gameId));
        //check if turn of player
        let gameTurn = this._svc.getTurn(gameId);
        let gamePhase = this._svc.getPhase(gameId);
        let gamePlayer = this._svc.getPlayer(gameId,playerId);
        let gamePlayerTurn =  gamePlayer.turn;
        let gamePlayerCount = this._svc.getPlayerCount(gameId);
        //check if chowed or drawn already
        this.validateTurnAndPhase(gameTurn,gamePlayerTurn,gamePlayerCount,gamePhase,domain.turnPhaseEnum.drawOrChow);
        
        //should store deck to var and save it later, but if splice apply to service's stored gameState's deck, 
        //then it will just be saved when applyState is called

        //splice card from deck
        let drawnCard = this._svc.getDeck(gameId).splice(0,1)[0];
        //push spliced card to player hand
        gamePlayer.hand.push(drawnCard);//TODO:: addHand
        //update phase
        gamePhase = domain.turnPhaseEnum.play;//TODO:: setPhase
        //apply save
        this._svc.applyState(gameId)
        //return spliced card
        return mapper.cardToResource(drawnCard);
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
    public Chow(gameId:number,playerId:number,playerCardIds:number[]) {
        this.validateGameOnGoing(this._svc.getWinMethod(gameId));
        if(playerCardIds.length < 2) //check if there are at least 2 cards
        {
            throw "badRequest:can't form a house with less than 3 cards"
        }
        let gameTurn = this._svc.getTurn(gameId);
        let gamePhase = this._svc.getPhase(gameId);
        let gamePlayer = this._svc.getPlayer(gameId,playerId);
        let gamePlayerTurn =  gamePlayer.turn;
        let gamePlayerCount = this._svc.getPlayerCount(gameId);

        this.validateTurnAndPhase(gameTurn,gamePlayerTurn,gamePlayerCount,gamePhase,domain.turnPhaseEnum.drawOrChow);
        this.validateCards(gamePlayer.hand.map(x => x.id),playerCardIds)//gameState,playerId,cardIds);
        //check combination if possible 
        let proposedHand: domain.card[] = [];
        //get lastDiscard as card
        let gameDiscards = this._svc.getDiscards(gameId); 
        proposedHand.push(gameDiscards[gameDiscards.length-1]);//last discard
        gamePlayer.hand.filter(x => playerCardIds.indexOf(x.id) != -1).forEach(x => proposedHand.push(x));//hand card to combine
        // playerCardIds.map(x => gamePlayer.hand[gamePlayer.hand.map(x => x.id).indexOf(x)]).forEach(x => proposedHand.push(x));// same, just cool
        this.validateCombination(proposedHand);
        //new house
        let gameHouses = this._svc.getHouses(gameId);
        let newHouse:domain.house = new domain.house();
        newHouse.id = gameHouses.length + 1;
        newHouse.playerId = playerId;
        //splice last discard to new house
        newHouse.cards.push(gameDiscards.splice(gameDiscards.length - 1,1)[0]);
        //splice from hand to new house
        //map hand cards to id, map playerCardIds to it's index //TOOK some secs to do, some secs to lose, and 1 hour to remake
        playerCardIds.map((x,i) => gamePlayer.hand.map(i => i.id).indexOf(x))
            .forEach(x => newHouse.cards.push(new domain.playedCard(gamePlayer.hand.splice(x,1)[0],playerId,gameTurn)));
        this._svc.addHouse(gameId,newHouse);
        //update phase
        gamePhase = domain.turnPhaseEnum.play;//TODO:: setPhase
        //check if won. condition: gamePlayer.hand.length == 0
        if(gamePlayer.hand.length == 0)
        {
            this._svc.setWinner(gameId,playerId,domain.winMethodEnum.noHand);
        }
        this._svc.applyState(gameId);
    }
    
    public Play(gameId:number, playerId: number, playCards: resource.playRequestResource){
        this.validateGameOnGoing(this._svc.getWinMethod(gameId));
        //discard is required
        if(!(playCards ? isNaN(playCards.discard) ? true : false  : false))
            return;
        let gameTurn = this._svc.getTurn(gameId);
        let gamePhase = this._svc.getPhase(gameId);
        let gamePlayer = this._svc.getPlayer(gameId,playerId);
        let gamePlayerTurn =  gamePlayer.turn;
        let gamePlayerCount = this._svc.getPlayerCount(gameId);
        let playerCardIds = [];
        playerCardIds.push(...this.flatten(playCards));
        this.validateTurnAndPhase(gameTurn,gamePlayerTurn,gamePlayerCount,gamePhase,domain.turnPhaseEnum.play);
        this.validateCards(gamePlayer.hand.map(x => x.id),playerCardIds)//gameState,playerId,cardIds);        
        //validate each request part
        //sapaw; forEach get house cards from game houses and player's card and validateCombination
        let gameHouses = this._svc.getHouses(gameId);
        playCards.sapaw.forEach(s => {
            let proposedSapaw:domain.card[] = [];
            let gameHouse = gameHouses.filter(gh => gh.id == s.houseId)[0].cards
            let pHandCards = s.cardId.map(cid => gamePlayer.hand.filter(c => c.id == cid)[0])
            proposedSapaw.push(...gameHouse,...pHandCards)
            this.validateCombination(proposedSapaw);
        })
        //house; forEach, get house cards from request, validateCombination
        playCards.houses.forEach(h => {
            let proposedHouse:domain.card[] = [];
            let house = h.map(x => gamePlayer.hand.filter(hc => hc.id == x)[0])
            proposedHouse.push(...house);
            this.validateCombination(proposedHouse);
        })
        //splice from hand, put to respective set of cards(list of sapaw, list of houses, discards)
        playCards.sapaw.forEach(s => {
            let handCardIndexes = s.cardId.map(cid => gamePlayer.hand.map(gh => gh.id).indexOf(cid))//index of requested cards
            handCardIndexes.forEach(i => {
                gameHouses.filter(gh => gh.id == s.houseId)[0]
                    .cards.push(new domain.playedCard(gamePlayer.hand.splice(i,1)[0],playerId,gameTurn))
            })
        })
        playCards.houses.forEach(h => {
            let handCardIndexes = h.map(cid => gamePlayer.hand.map(gh => gh.id).indexOf(cid))//index of requested cards
            let newHouse = new domain.house();
            newHouse.id = gameHouses.length + 1;
            newHouse.playerId = playerId;
            handCardIndexes.forEach(i => {
                newHouse.cards.push(new domain.playedCard(gamePlayer.hand.splice(i,1)[0],playerId,gameTurn))
            })
            gameHouses.push(newHouse);
        })
        let gameDiscards = this._svc.getDiscards(gameId);
        let discardIndex = gamePlayer.hand.map(x => x.id).indexOf(playCards.discard)
        gameDiscards.push(new domain.playedCard(gamePlayer.hand.splice(discardIndex,1)[0],playerId,gameTurn))
        //apply
        this._svc.applyState(gameId);
        //mark winner, run out of deck, run out of handcards
        if(gamePlayer.hand.length == 0) {
            this._svc.setWinner(gameId,playerId,domain.winMethodEnum.noHand);
        }
        if(this._svc.getDeck.length < 1){
            this._svc.setWinner(gameId,playerId,domain.winMethodEnum.leastHand);
        }
        //if deck.length == 0, player with least hand
    }
    
    private generateDeck(){
        let deck:domain.card[] = [];
        for (var i = 0; i < 52; i++)
            deck.push(new domain.card(i, ((i + 1) % rps) || rps, suite[suite[Math.floor(i / rps) + 1]]));
        return deck;
    }
    private shuffle(deck: domain.card[]){
        let returnDeck: domain.card[] = [];
        let cloneDeck = deck.map(x => x);
        deck.forEach(function (card,index){
            let randomCardIndex = Math.floor(Math.random() * cloneDeck.length);
            let randomCardTaken = cloneDeck.splice(randomCardIndex,1)[0];
            returnDeck.push(randomCardTaken);
        })
        return returnDeck;
    }
    private validateGameOnGoing(winMethod:domain.winMethodEnum): boolean{
        if(winMethod) throw "badRequest: game already won"
        else return true;
    }
    private validateTurnAndPhase(gameTurn:number,playerTurn:number,playerCount:number,gamePhase:domain.turnPhaseEnum,shouldBeTurnPhase:domain.turnPhaseEnum): boolean {

        if(playerTurn != ((gameTurn - 1) % playerCount)+1 ) {
            throw "notAllowed: mot your turn"; 
            // return false;
        }
        if(gamePhase != shouldBeTurnPhase) {
            throw "notAllowed: not a valid move"; 
            // return false;
        }
        return true;
    }

    private validateCards(gamePlayerHandCardIds:number[],playerCardIds: number[]):boolean {
        let isCardFromPlayer:boolean = playerCardIds.every(x => gamePlayerHandCardIds.indexOf(x) != -1);// all cards passed is indeed from player's hand'
        let noDupClientCards:boolean = playerCardIds.every((c,i) => playerCardIds.indexOf(c) == i);//check if there are duplicates in clientPlayerCards

        if(!(isCardFromPlayer && noDupClientCards)) {
            throw "notAllowed:cards does not match";
            // return false;
        }
        return true;
    }

    private validateCombination (cards:domain.card[]) : boolean{
        if (!(this.isTrioQuadro(cards) || this.isStraightFlush(cards))) {
            throw "notAllowed: can't make a house"
            // return false;
        }
        return true;
    }
    private isTrioQuadro(cards:domain.card[]) : boolean{
        return cards.every(x => x.rank == cards[0].rank)
    }
    
    private isStraightFlush(cards:domain.card[]) : boolean{
        let isFlush = cards.every(x => x.suite == cards[0].suite);
        cards = cards.sort((p,n) => p.rank - n.rank);
        let is1Consecutive = cards.every((x,i) => ((cards[i+1-(Math.floor((i+1)/cards.length))].rank) - x.rank) < 2)
        return (isFlush && is1Consecutive) 
    }

    private flatten(req:resource.playRequestResource): number[]{//type should be playRequestResource
        let flatCardIds:number[] = [];
        !isNaN(req.discard) ? flatCardIds.push(req.discard) : null;
        req.houses ? req.houses.forEach(x => flatCardIds.push(...x)) : null;
        req.sapaw ? req.sapaw.forEach(x => flatCardIds.push(...x.cardId)) : null;
        return flatCardIds.filter(x => !isNaN(x) && x > 0);
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