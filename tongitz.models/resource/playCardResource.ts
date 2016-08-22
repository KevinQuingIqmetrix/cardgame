/*
playCards{
    sapaw[]?{houseId: number, cardId[]: number},
    house[]?{cardid[]: number},
    discardCardId?: number
}
 */
export interface playCardResource {
    sapaw?:sapaw[];
    house?:house[];
    discard?:number;
}

interface sapaw {
    houseId: number;
    cardId: number[];
}
interface house {
    cardId: number[];
}