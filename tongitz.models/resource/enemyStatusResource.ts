//the conformity version..
import {playerStatusResource} from "tongitz.models/resource/playerStatusResource"
export interface enemyStatusResource extends playerStatusResource{
    hand: number;
}