import {gameStateResource,houseResource,myStatusResource,enemyStatusResource,turnPhaseEnum} from "../tongitz.models/resource/gameStateResource"
import {playedCardResource} from "../tongitz.models/resource/cardResource"

import {gameState} from "../tongitz.models/domain/gameState"
import {card, playedCard} from "../tongitz.models/domain/card"

export class mapper{
    public static gameStateToResource(gameState:gameState, playerId?:number){
        // let turnByPlayerId = ((gameState.turn-1) % gameState.playerStatuses.length) + 1;
        // let lastDiscard:any = gameState.discards[gameState.discards.length-1];
        // lastDiscard.playerName = "";
        // let lastDiscardResource = lastDiscard as playedCardResource;
        // let player = gameState.playerStatuses.filter(p => p.id == turnByPlayerId)[0]
        // let myStatus = {
        //     name:player.name,
        //     discards: gameState.discards.filter(d => d.playerId == playerId) as any as playedCardResource,

        // } as myStatusResource 
        // let gameStateResource:gameStateResource = {
        //     gameId: gameState.id,
        //     playerId: playerId,

        //     turn: gameState.turn,
        //     turnPhase: gameState.turnPhase,
        //     playerTurn: player.name,
        //     myTurn: playerId == turnByPlayerId,
            
        //     deck: gameState.deck.length,
        //     lastDiscard: lastDiscard,

        //     status: ,
        //     enemyStatus: enemyStatusResource,

        //     error: string[]
        // } ;
        // return gameStateResource
        return {} as gameStateResource;
    }
}