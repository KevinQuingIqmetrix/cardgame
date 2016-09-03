//3rd party
var fs = require("fs");
const writeFiles = require('write-files');
//models
import {gameState} from             "../tongitz.models/domain/gameState"
import {card} from                  "../tongitz.models/domain/card"
import {playedCard} from            "../tongitz.models/domain/playedCard"
import {turnPhaseEnum} from         "../tongitz.models/domain/turnPhaseEnum"
import {playerStatus} from          "../tongitz.models/domain/playerStatus"
import {house} from                 "../tongitz.models/domain/house"
import {suite} from                 "../tongitz.models/domain/suite"
import {winMethodEnum} from         "../tongitz.models/domain/winMethodEnum"

const ff = "json"; //fileformat
export interface ITongitzService {
    //add game
    addGame(gameId:number,turn:number,turnPhase:turnPhaseEnum)
    //gets turn number
    getTurn(gameId:number): number;
    //gets turn number
    getPhase(gameId:number): turnPhaseEnum;
    //adds players
    addPlayer(gameId:number,player:playerStatus)
    //get playerStatus
    getPlayer(gameId:number, playerId: number):playerStatus
    //get Players Count
    getPlayerCount(gameId:number): number;
    //returns deck(card[])
    getDeck(gameId: number): card[]
    //sets deck
    setDeck(gameId:number,deck:card[])
    //return discards: playedCard[]
    getDiscards(gameId:number):playedCard[]
    //adds house
    addHouse(gameId:number,house:house);
    //return houses:house[]
    getHouses(gameId:number):house[];
    //return winner id
    getWinMethod(gameId:number): winMethodEnum;
    //set win method
    //set winner player id
    setWinner(gameId:number,playerId:number,winMethod:winMethodEnum)
    //returns gameState from file
    fetchState(gameId:number): gameState;
    //saves gamestates to file
    applyState(gameId:number);

    saveState(gameState:gameState,id?:number);
    loadState(id?:number): gameState;
}
export class TongitzService //implements ITongitzService 
{
    //where gameState are stored for more fetches and saves
    gameStates:gameState[] = [];
    addGame(gameId:number,turn:number,turnPhase:turnPhaseEnum){
        gameId = gameId ? gameId : 1;
        // let savedGameState = this.fetchState(gameId)
        let newGame = new gameState();
        newGame.id = gameId;
        newGame.turn = turn;
        newGame.turnPhase = turnPhase;
    }
    getTurn(gameId:number): number{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.turn;
    }
    getPhase(gameId:number): turnPhaseEnum{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.turnPhase;
    }
    addPlayer(gameId:number,player:playerStatus){
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        savedGameState.playerStatuses.push(player);
    }
    getPlayer(gameId:number, playerId: number):playerStatus{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.playerStatuses.filter(x => x.id == playerId)[0];
    }
    getPlayerCount(gameId:number): number{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.playerStatuses.length;
    }
    getDeck(gameId: number): card[]{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.deck;
    }
    setDeck(gameId:number,deck:card[]){
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        savedGameState.deck = deck;
    }
    getDiscards(gameId:number):playedCard[]{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.discards;
    }
    addHouse(gameId:number,house:house){
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        savedGameState.houses.push(house);
    }
    getHouses(gameId:number):house[]{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.houses;
    }
    getWinMethod(gameId:number): winMethodEnum{
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        return savedGameState.winMethod;
    }
    setWinner(gameId:number,playerId:number,winMethod:winMethodEnum){
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        savedGameState.winnerId = playerId;
        savedGameState.winMethod = winMethod;
    }
    fetchState(gameId:number): gameState{
        gameId = gameId ? gameId : 1;
        if(this.gameStates.filter(x => x.id == gameId).length > 0){
            return this.gameStates.filter(x => x.id == gameId)[0]
        }
        else {
            let gameState = JSON.parse(this.loadFromFile(gameId)) as gameState;
            if(!this.isEmpty(gameState)){
                this.gameStates.push(gameState);
                return gameState;
            }
            throw "BadRequest: no saved state of that game";
        }
    }
    applyState(gameId:number){
        gameId = gameId ? gameId : 1;
        let savedGameState = this.fetchState(gameId)
        this.saveToFile(JSON.stringify(savedGameState),gameId);
    }

    
    saveToFile(json: string, id:number) {
        // let filename = `tong${id}.${ff}`
        // let filejson = `{${filename}:{}}`;
        // let file = JSON.parse(filejson)
        let file = {"game.json":json}
        writeFiles(file, err => {
            if(err) {
                console.log(err);
                throw err;
            }
        })
    }
    loadFromFile(fileName: number){
        // let fileString:string = fs.readFileSync(`tong${fileName}.${ff}`, 'utf8');
        let fileString:string = fs.readFileSync("game.json")
        return fileString;
    }
    private isEmpty(obj) {
        if (obj == null) return true;
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        if (typeof obj !== "object") return true;
        for (var key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

}