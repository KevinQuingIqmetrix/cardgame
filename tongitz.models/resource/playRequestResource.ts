import {sapawResource} from "./sapawResource"
export interface playRequestResource {
    sapaw?:sapawResource[];
    house?:number[][];
    discard?:number;
}

interface house {
    cardId: number[];
}