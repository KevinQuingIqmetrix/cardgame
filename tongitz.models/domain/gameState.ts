/*
gamestate
----status of game viewed by one player
*/
import {card} from "./card"
import {playedCard} from "./playedCard"
import {turnPhaseEnum} from "./turnPhaseEnum"
import {playerStatus} from "./playerStatus"
import {house} from "./house"
import {winMethodEnum} from "./winMethodEnum"
export class gameState{
    /**
     *
     */
    constructor() {
    }
    public id: number;

    public turn: number;
    public turnPhase:turnPhaseEnum;
    public playerStatuses: playerStatus[] = [];

    public deck: card[] = [];
    public discards: playedCard[] = [];
    public houses: house[] = [];

    public winnerId?:number
    public winMethod?:winMethodEnum

    public error: string[] = [];
}


