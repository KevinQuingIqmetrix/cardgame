import {card} from "tongitz.models/domain/card"
export class playedCard extends card{
    /**
     *when card is played(discard,house,sapaw)
     */
    constructor(Card:card,
                public playerId: number,
                public turn: number) {
        super(Card.id,Card.rank,Card.suite);
    }
}