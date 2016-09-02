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
    getHouses(gameId:number):house[]

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
    gameStates:gameState[];
    /**
     *
     */
    constructor() {
        this.gameStates = [];
    }
    public saveState(gameState:gameState,id?: number)
    {
        id = id ? id : 1;
        this.saveToFile(JSON.stringify(gameState),id);
    }
    public loadState(gameId?:number): gameState{
        gameId = gameId ? gameId : 1;
        return JSON.parse(this.loadFromFile(gameId)) as gameState;
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
}