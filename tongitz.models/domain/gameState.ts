/*
gamestate
----status of game viewed by one player
*/
import {card} from "tongitz.models/domain/card"
import {playedCard} from "tongitz.models/domain/playedCard"
import {turnPhaseEnum} from "tongitz.models/domain/turnPhaseEnum"
import {playerStatus} from "tongitz.models/domain/playerStatus"
import {house} from "tongitz.models/domain/house"
export class gameState{
    /**
     *
     */
    constructor() {
    }
    public id: number;

    public turn: number;
    public turnPhase:turnPhaseEnum;
    public playerStatuses: playerStatus[];

    public deck: card[];
    public discards: playedCard[];
    public houses: house[];
    public winner?:number
    public error: string[];
}


