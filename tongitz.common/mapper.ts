//domain
import domain = require("../tongitz.models/domain/_domain")
//resource
import {gameStateResource} from     "../tongitz.models/resource/gameStateResource" 
import {cardResource} from          "../tongitz.models/resource/cardResource"
import {playedCardResource} from    "../tongitz.models/resource/playedCardResource"
import {myStatusResource} from      "../tongitz.models/resource/myStatusResource"
import {enemyStatusResource} from   "../tongitz.models/resource/enemyStatusResource"
import {turnPhaseEnumResource} from "../tongitz.models/resource/turnPhaseEnumResource"
import {suiteEnumResource} from     "../tongitz.models/resource/suiteEnumResource"
import {houseResource} from         "../tongitz.models/resource/houseResource"
import {playerStatusResource} from  "../tongitz.models/resource/playerStatusResource"
import {winMethodEnumResource} from "../tongitz.models/resource/winMethodEnumResource"


    //toResourceMap
    export function gameStateToResource (gameState:domain.gameState, playerId:number): gameStateResource{
        let t = gameState;
        let turnBy =t.playerStatuses.filter(p => p.turn == (((t.turn-1) % t.playerStatuses.length)+1))[0]; 
        let winner = t.winnerId ? [t.winnerId].map(x => t.playerStatuses.filter(x => x.id)[0].name)[0] : ''
        // let lastDiscardBy = t.playerStatuses.filter(p => p.id == t.discards[t.discards.length-1].playerId)[0];
        let idName: [number,string][] = t.playerStatuses.map(x => [x.id,x.name] as [number,string])
        return {
            gameId: t.id,
            playerId: playerId,
            turn: t.turn,
            turnPhase: this.turnPhaseEnumToResource(t.turnPhase),
            playerTurn: turnBy.name,
            myTurn: playerId == turnBy.id,
            deck: t.deck.length,
            lastDiscard: this.playedCardToResource(t.discards[t.discards.length-1],idName),
            status:this.playerStatusToMyStatus(t.playerStatuses.filter(x => x.id == playerId)[0],t.discards,t.houses),
            enemyStatus: this.playerStatusToEnemyStatuses(t.playerStatuses.filter(x => x.id != playerId),t.discards,t.houses),
            winMethod: this.winMethodEnumToResource(t.winMethod),
            winnerName: winner,
            isWinner: t.winnerId == playerId,
            error: []
        } as gameStateResource;
    }
    export function cardToResource (card:domain.card) : cardResource{
        return {
            id : card.id,
            suite : this.suiteToResource(card.suite),
            rank : card.rank
        } as cardResource;
    }

    export function playedCardToResource(playedCard:domain.playedCard,player:[number,string][]) : playedCardResource {
        if (!playedCard) return null;
        return this.playedCardToResourceWithName(playedCard,player.filter(p => p[0] == playedCard.playerId)[0][1])
    }
    export function playedCardToResourceWithName (playedCard:domain.playedCard,player:string) : playedCardResource {
        return {
            turn : playedCard.turn,
            playerName: player,
            id: playedCard.id,
            suite: this.suiteToResource(playedCard.suite),
            rank: playedCard.rank
        } as playedCardResource
    }

    export function suiteToResource(suite:domain.suite) : suiteEnumResource {
        return suiteEnumResource[suiteEnumResource[suite]];
    }

    export function turnPhaseEnumToResource(turnPhase:domain.turnPhaseEnum):turnPhaseEnumResource{
        return turnPhaseEnumResource[turnPhaseEnumResource[turnPhase]];
    }

    export function houseToResource(house:domain.house,player:[number,string][]) : houseResource {
        return this.houseToResourceWithName(house,player.filter(p => p[0] == house.playerId)[0][1])
    }
    export function houseToResourceWithName(house:domain.house,player:string) : houseResource {
        let t = house;
        return {
            id: t.id,
            cards: house.cards.map(c => this.playedCardToResourceWithName(c,player))
        } as houseResource;
    }
    export function playerStatusToMyStatus (playerStatus:domain.playerStatus,discards:domain.playedCard[],houses:domain.house[]) : myStatusResource {
        let t = playerStatus;
        let pStat = this.playerStatusToPlayerStatusResource(playerStatus,discards,houses) as myStatusResource;
        pStat.hand = t.hand.map(c => this.cardToResource(c));
        return pStat;
    }
    export function playerStatusToEnemyStatuses (playerStatuses:domain.playerStatus[],discards:domain.playedCard[],houses:domain.house[]) : enemyStatusResource[] {
        let t = playerStatuses;
        
        let pStats = t.map(p => this.playerStatusToPlayerStatusResource(p,discards,houses) as enemyStatusResource);
        
        pStats.forEach((p,i) => p.hand = t[i].hand.length);

        return pStats;//[] as enemyStatusResource[];
    }
    export function playerStatusToPlayerStatusResource (playerStatus:domain.playerStatus, discards: domain.playedCard[], houses:domain.house[]): playerStatusResource {
        let t = playerStatus;
        return {
            name:t.name,
            turn: t.turn,
            discards: discards.filter(c => c.playerId == t.id).map(c => this.playedCardToResourceWithName(c,t.name)),
            houses: houses.filter(h => h.playerId == t.id).map(h => this.houseToResourceWithName(h,t.name))
        } as playerStatusResource;
    }
    export function winMethodEnumToResource(winMethod:domain.winMethodEnum): winMethodEnumResource{
        return winMethod ? winMethodEnumResource[winMethodEnumResource[winMethod]] : null;
    }
