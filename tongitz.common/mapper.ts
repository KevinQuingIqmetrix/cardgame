//domain
import domain = require("../tongitz.models/domain/_domain")
//resource
import resource = require("../tongitz.models/resource/_resource")


    //toResourceMap
    export function gameStateToResource (gameState:domain.gameState, playerId:number): resource.gameStateResource{
        let t = gameState;
        let turnBy = t.playerStatuses.length ? t.playerStatuses.filter(p => p.turn == (((t.turn-1) % t.playerStatuses.length)+1))[0] : null; 
        let winner = t.winnerId ? [t.winnerId].map(x => t.playerStatuses.filter(x => x.id)[0].name)[0] : ''
        // let lastDiscardBy = t.playerStatuses.filter(p => p.id == t.discards[t.discards.length-1].playerId)[0];
        let idName: [number,string][] = t.playerStatuses.length ? t.playerStatuses.map(x => [x.id,x.name] as [number,string]) : [];
        return {
            gameId: t.id,
            playerId: playerId,
            turn: t.turn,
            turnPhase: this.turnPhaseEnumToResource(t.turnPhase),
            playerTurn: turnBy ? turnBy.name : "",
            myTurn: playerId == (turnBy ? turnBy.id : -1),
            deck: t.deck.length,
            lastDiscard: t.discards ? this.playedCardToResource(t.discards[t.discards.length-1],idName) : null,
            status: t.playerStatuses.length ? this.playerStatusToMyStatus(t.playerStatuses.filter(x => x.id == playerId)[0],t.discards,t.houses) : null,
            enemyStatus: t.playerStatuses.length ? this.playerStatusToEnemyStatuses(t.playerStatuses.filter(x => x.id != playerId),t.discards,t.houses) : null,
            winMethod: this.winMethodEnumToResource(t.winMethod),
            winnerName: winner,
            isWinner: t.winnerId == playerId,
            error: []
        } as resource.gameStateResource;
    }
    export function cardToResource (card:domain.card) : resource.cardResource{
        return {
            id : card.id,
            suite : this.suiteToResource(card.suite),
            rank : card.rank
        } as resource.cardResource;
    }

    export function playedCardToResource(playedCard:domain.playedCard,player:[number,string][]) : resource.playedCardResource {
        if (!playedCard) return null;
        return this.playedCardToResourceWithName(playedCard,player.filter(p => p[0] == playedCard.playerId)[0][1])
    }
    export function playedCardToResourceWithName (playedCard:domain.playedCard,player:string) : resource.playedCardResource {
        return {
            turn : playedCard.turn,
            playerName: player,
            id: playedCard.id,
            suite: this.suiteToResource(playedCard.suite),
            rank: playedCard.rank
        } as resource.playedCardResource
    }

    export function suiteToResource(suite:domain.suite) : resource.suiteEnumResource {
        return resource.suiteEnumResource[resource.suiteEnumResource[suite]];
    }

    export function turnPhaseEnumToResource(turnPhase:domain.turnPhaseEnum):resource.turnPhaseEnumResource{
        return resource.turnPhaseEnumResource[resource.turnPhaseEnumResource[turnPhase]];
    }

    export function houseToResource(house:domain.house,player:[number,string][]) : resource.houseResource {
        return this.houseToResourceWithName(house,player.filter(p => p[0] == house.playerId)[0][1])
    }
    export function houseToResourceWithName(house:domain.house,player:string) : resource.houseResource {
        let t = house;
        return {
            id: t.id,
            cards: house.cards.map(c => this.playedCardToResourceWithName(c,player))
        } as resource.houseResource;
    }
    export function playerStatusToMyStatus (playerStatus:domain.playerStatus,discards:domain.playedCard[],houses:domain.house[]) : resource.myStatusResource {
        let t = playerStatus;
        let pStat = this.playerStatusToPlayerStatusResource(playerStatus,discards,houses) as resource.myStatusResource;
        pStat.hand = t.hand.map(c => this.cardToResource(c));
        return pStat;
    }
    export function playerStatusToEnemyStatuses (playerStatuses:domain.playerStatus[],discards:domain.playedCard[],houses:domain.house[]) : resource.enemyStatusResource[] {
        let t = playerStatuses;
        
        let pStats = t.map(p => this.playerStatusToPlayerStatusResource(p,discards,houses) as resource.enemyStatusResource);
        
        pStats.forEach((p,i) => p.hand = t[i].hand.length);

        return pStats;//[] as enemyStatusResource[];
    }
    export function playerStatusToPlayerStatusResource (playerStatus:domain.playerStatus, discards: domain.playedCard[], houses:domain.house[]): resource.playerStatusResource {
        let t = playerStatus;
        return {
            name:t.name,
            turn: t.turn,
            discards: discards.filter(c => c.playerId == t.id).map(c => this.playedCardToResourceWithName(c,t.name)),
            houses: houses.filter(h => h.playerId == t.id).map(h => this.houseToResourceWithName(h,t.name))
        } as resource.playerStatusResource;
    }
    export function winMethodEnumToResource(winMethod:domain.winMethodEnum): resource.winMethodEnumResource{
        return winMethod ? resource.winMethodEnumResource[resource.winMethodEnumResource[winMethod]] : null;
    }
