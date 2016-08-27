import {playerStatusResource} from "tongitz.models/resource/playerStatusResource"
import {cardResource} from "tongitz.models/resource/cardResource"
export interface myStatusResource extends playerStatusResource{
    hand: cardResource[];
}