import {playedCardResource} from "./playedCardResource"
export interface houseResource {
    id: number;
    cards: playedCardResource[];
}