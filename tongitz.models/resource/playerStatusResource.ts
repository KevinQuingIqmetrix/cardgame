import {cardResource} from "tongitz.models/resource/cardResource"
import {playedCardResource} from "tongitz.models/resource/playedCardResource"
import {houseResource} from "tongitz.models/resource/houseResource"

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