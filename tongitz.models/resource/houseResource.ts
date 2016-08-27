import {playedCardResource} from "tongitz.models/resource/playedCardResource"
export interface houseResource {
    id: number;
    cards: playedCardResource[];
}