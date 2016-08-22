//services
import {TongitzService,ITongitzService} from "../tongitz.services/TongitzService"
//models
import {gameStateResource} from "../tongitz.models/resource/gameStateResource"
import {cardResource} from "../tongitz.models/resource/cardResource"
import {playCardResource} from "../tongitz.models/resource/playCardResource"
// class cardResource {}
// class playCardResource {}
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
class TongitzApi implements ITongitzApi {
    _tongitzService: ITongitzService;

    constructor(tongitzService?: ITongitzService) {
        if(tongitzService)
            this._tongitzService = tongitzService;
        else this._tongitzService = new TongitzService();
    }
    NewGame (...p: string[]) {
        return {} as gameStateResource;
    }
    GetStatus (id: number) {
        return {} as gameStateResource;
    }
    Chow(cards:number[]) {
        console.log(cards)
    }
    Draw(){
        return {} as cardResource;
    }
    Play(playCards: playCardResource){
        return {} as gameStateResource;
    }
}

class thing {
    /**
     *
     */
    constructor(public int: number) {
        console.log("initialized");
    }
    ha(){
        console.log("ha");
    }
}
var a = new thing(1);
console.log(a);
console.log(JSON.stringify(a));
console.log(thing);
console.log(JSON.stringify(thing));