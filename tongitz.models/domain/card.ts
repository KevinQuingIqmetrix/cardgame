import {suite} from "./suite";
export class card{
    /**
     *card model
     */
    constructor(
        public id:number,
        public rank: number,
        public suite: suite
    ) {
        
    }
}
export class playedCard extends card{
    /**
     *when card is played(discard,house,sapaw)
     */
    constructor(public Card:card,
                public playerId: number,
                public turn: number) {
        super(Card.id,Card.rank,Card.suite);
    }
}
