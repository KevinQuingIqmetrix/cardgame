/*
gamestate
----status of game viewed by one player
*/
import {card} from "./card"
import {playedCard} from "./playedCard"
import {turnPhaseEnum} from "./turnPhaseEnum"
import {playerStatus} from "./playerStatus"
import {house} from "./house"
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
    public winner?:number
    public error: string[] = [];
}


