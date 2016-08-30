/*
gamestate
----status of game viewed by one player
*/
import {cardResource} from "tongitz.models/resource/cardResource"
import {playedCardResource} from "tongitz.models/resource/playedCardResource"
import {myStatusResource} from "tongitz.models/resource/myStatusResource"
import {enemyStatusResource} from "tongitz.models/resource/enemyStatusResource"
import {turnPhaseEnumResource} from "./turnPhaseEnumResource"

export interface gameStateResource{
    //id of game
    gameId: number;
    //id of player viewing the game state
    playerId: number
    //current turn number of the game
    turn: number;
    //turn phase of the current turn
    turnPhase: turnPhaseEnumResource;
    //whose turn
    playerTurn: string;
    //turn of the player viewing the game state
    myTurn: boolean;
    //number of cards left in deck
    deck: number;
    //last discarded card
    lastDiscard: playedCardResource ;
    //cards played and unplayed by the player viewing the game state
    status: myStatusResource;
    //cards by enemy
    enemyStatus: enemyStatusResource[];
    //internal error maybe..
    error: string[];
}