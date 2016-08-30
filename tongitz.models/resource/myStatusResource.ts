import {playerStatusResource} from  "./playerStatusResource"
import {cardResource} from          "./cardResource"
export interface myStatusResource extends playerStatusResource{
    hand: cardResource[];
}