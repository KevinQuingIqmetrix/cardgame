/*
gamestate
----status of game viewed by one player
*/
import {cardResource} from "./cardResource"
import {playedCardResource} from "./playedCardResource"
import {myStatusResource} from "./myStatusResource"
import {enemyStatusResource} from "./enemyStatusResource"
import {turnPhaseEnumResource} from "./turnPhaseEnumResource"
import {winMethodEnumResource} from "./winMethodEnumResource"

export class gameStateResource{
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

    //win Method
    winMethod?: winMethodEnumResource;
    //winner name
    winnerName: string;
    //is Winner
    isWinner:boolean;

    //internal error maybe..
    error: string[];
}