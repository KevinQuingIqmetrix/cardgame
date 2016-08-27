import {sapawResource} from "tongitz.models/resource/sapawResource"
export interface playRequestResource {
    sapaw?:sapawResource[];
    house?:number[][];
    discard?:number;
}

interface house {
    cardId: number[];
}