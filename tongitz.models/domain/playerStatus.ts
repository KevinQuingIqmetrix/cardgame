
import {card} from "./card"
export class playerStatus {
    //id of player
    id: number;
    //turn of player (1st,2nd,...)
    turn:number;
    //name of player
    name: string;
    //list of player's cards on hand
    hand: card[];
}