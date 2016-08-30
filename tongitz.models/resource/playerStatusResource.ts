import {cardResource} from          "./cardResource"
import {playedCardResource} from    "./playedCardResource"
import {houseResource} from         "./houseResource"

export interface playerStatusResource {
    //name of player
    name: string;
    //turn number (1st,2nd,...)
    turn:number;
    //list of player's discards 
    discards: playedCardResource[];
    //list of player's house
    houses: houseResource[];
}